import { MakeAnInvoiceCommand } from "@invoice/application-service/command/make-an-invoice.command";
import { Invoice } from "@invoice/domain/model/invoice";
import { InvoiceRepository } from "@invoice/domain/service/invoice.repository";
import { InvoiceOrderRepository } from "@invoice/domain/service/invoice-order.repository";
import { Result } from "@sefr/result";
import { CommandHandler } from "@shared/command";
import { DomainError } from "@shared/domain-error";
import { Id } from "@shared/id";
import { Saga } from "@shared/saga";
import { Time } from "@shared/time";

import { InvoiceCreatedForOrder } from "@invoice/domain/event/invoice-created-for-order.event";

class FailedToCreateInvoice extends DomainError {
	public readonly invoiceNumber: string;

	constructor(invoiceId: string) {
		super(`Could not create invoice with id ${invoiceId}`);
		this.invoiceNumber = invoiceId;
	}
}

export class MakeAnInvoiceCommandHandler implements CommandHandler<MakeAnInvoiceCommand>, Saga.Step {
	constructor(private readonly time: Time, private readonly id: Id, private readonly orders: InvoiceOrderRepository, private readonly invoices: InvoiceRepository) {
	}

	public async execute(command: MakeAnInvoiceCommand): Promise<Result<InvoiceCreatedForOrder | Error>> {
		const order = await this.orders.getOne(command.content.orderNumber);
		const invoice = new Invoice(this.id.generate(), order, this.time.now());

		try {
			await this.invoices.create(invoice);
		} catch (e) {
			return Result.failure(new FailedToCreateInvoice(invoice.number));
		}

		return Result.ok(new InvoiceCreatedForOrder("SEFR", this.time.now(), {
			orderNumber: invoice.getOrderNumber(),
			invoiceNumber: invoice.number,
			emitted: invoice.emitted,
		}));
	}

	public async compensate(): Promise<void> {
		return new Promise((resolve) => {
			console.info("Nothing to compensate here");
			resolve();
		});
	}
}
