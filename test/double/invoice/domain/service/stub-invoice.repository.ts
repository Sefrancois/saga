import { InvoiceDatasource } from "@datasource/invoice.datasource";
import { Invoice } from "@invoice/domain/model/invoice";
import { InvoiceRepository } from "@invoice/domain/service/invoice.repository";

export class StubInvoiceRepository implements InvoiceRepository {
	constructor(private readonly invoiceDatasource: InvoiceDatasource) {
	}

	public async remove(invoiceNumber: string): Promise<void> {
		await this.invoiceDatasource.remove(invoiceNumber);
    }

	public async create(invoice: Invoice): Promise<void> {
        await this.invoiceDatasource.save({ number: invoice.number, orderNumber: invoice.getOrderNumber(), emitted: invoice.emitted });
    }
}
