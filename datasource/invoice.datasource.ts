import { InvoiceEntity } from "@datasource/entity/invoice.entity";

export class InvoiceDatasource {
	private readonly invoices: Array<InvoiceEntity>;

	constructor(orders: Array<InvoiceEntity>) {
		this.invoices = orders;
	}

	public save(invoice: Partial<InvoiceEntity>): Promise<void> {
		if (invoice.number) {
			const indexOfExistingOrder = this.invoices.findIndex((invoiceEntity) => invoiceEntity.number === invoice.number);

			if (indexOfExistingOrder >= 0) {
				this.invoices[indexOfExistingOrder] = { ...this.invoices[indexOfExistingOrder], ...invoice };
			} else {
				this.invoices.push({ number: invoice.number, orderNumber: invoice.orderNumber, emitted: invoice.emitted });
			}
		} else {
			throw new Error("Cannot find existing invoice or create new invoice without invoice number.");
		}
		return Promise.resolve();
	}

	public getOne(invoiceNumber: string): Promise<InvoiceEntity> {
		const invoice = this.invoices.find((invoice) => invoice.number === invoiceNumber);
		if (invoice) return Promise.resolve(invoice);
		else throw new Error("Cannot find existing invoice or create new invoice without invoice number.");
	}

	public remove(invoiceNumber: string): Promise<void> {
		const invoiceIndex = this.invoices.findIndex((invoice) => invoice.number === invoiceNumber);
		if (invoiceIndex >= 0) {
			this.invoices.splice(invoiceIndex, 1);
			return Promise.resolve();
		}
		else throw new Error(`Cannot remove invoice with number ${invoiceNumber}`);
	}
}
