import { DomainEvent } from "@shared/domain-event";

export class InvoiceCreatedForOrder extends DomainEvent<InvoiceCreatedForOrderContent> {
	constructor(author: string, emitted: Date, content: InvoiceCreatedForOrderContent) {
		super(author, emitted, content);
	}
}

type InvoiceCreatedForOrderContent = {
	invoiceNumber: string;
	orderNumber: string;
	emitted: Date;
}
