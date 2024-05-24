import { Invoice } from "@invoice/domain/model/invoice";

export interface InvoiceRepository {
	create(invoice: Invoice): Promise<void>;
	remove(invoiceNumber: string): Promise<void>;
}
