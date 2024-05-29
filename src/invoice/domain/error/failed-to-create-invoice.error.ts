import { DomainError } from "@shared/domain-error";

export class FailedToCreateInvoice extends DomainError<{ invoiceId: string | undefined, orderNumber: string }> {
	constructor(orderNumber: string, invoiceId?: string) {
		super(`Could not create invoice with id ${invoiceId}`, { invoiceId, orderNumber });
	}
}
