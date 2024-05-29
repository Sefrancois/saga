import { MakeAnInvoiceCommand } from "@invoice/application-service/command/make-an-invoice.command";
import { FailedToCreateInvoice } from "@invoice/domain/error/failed-to-create-invoice.error";
import { InvoiceCreatedForOrder } from "@invoice/domain/event/invoice-created-for-order.event";
import { Invoice } from "@invoice/domain/model/invoice";
import { InvoiceRepository } from "@invoice/domain/service/invoice.repository";
import { InvoiceOrderRepository } from "@invoice/domain/service/invoice-order.repository";
import { Result } from "@sefr/result";
import { CommandHandler } from "@shared/command";
import { Id } from "@shared/id";
import { Saga } from "@shared/saga";
import { Time } from "@shared/time";

export class MakeAnInvoiceCommandHandler implements CommandHandler<MakeAnInvoiceCommand>, Saga.Step<MakeAnInvoiceCommand, InvoiceCreatedForOrder | FailedToCreateInvoice> {
	Command = MakeAnInvoiceCommand;

	constructor(private readonly time: Time, private readonly id: Id, private readonly orders: InvoiceOrderRepository, private readonly invoices: InvoiceRepository) {
	}

	public async execute(command: MakeAnInvoiceCommand): Promise<Result<InvoiceCreatedForOrder | FailedToCreateInvoice>> {
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

	public async compensate(input: Saga.CompensationMessage<unknown>): Promise<Saga.CompensationMessage<unknown>> {
		return new Promise((resolve) => {
			console.info("Nothing to compensate here");
			resolve(input);
		});
	}
}
