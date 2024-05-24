import { Command } from "../../../shared/command";

type MakeAnInvoiceContent = {
	orderNumber: string;
}

export class MakeAnInvoiceCommand extends Command<MakeAnInvoiceContent> {
	constructor(content: MakeAnInvoiceContent) {
		super(Symbol("MakeAnInvoiceCommand"), content);
	}
}
