import { MakeAnInvoiceCommand } from "@invoice/application-service/command/make-an-invoice.command";
import { Invoice } from "@invoice/domain/model/invoice";
import { InvoiceRepository } from "@invoice/domain/service/invoice.repository";
import { OrderRepository } from "@invoice/domain/service/order.repository";
import { Result } from "@sefr/result";
import { CommandHandler } from "@shared/command";
import { DomainError } from "@shared/domain-error";
import { Id } from "@shared/id";
import { Saga } from "@shared/saga";
import { Time } from "@shared/time";
import {
	InvoicedCreatedForOrder,
} from "@test/invoice/application-service/command/make-an-invoice.command-handler.spec";

class FailedToCreateInvoice extends DomainError {
	public readonly invoiceNumber: string;

	constructor(invoiceId: string) {
		super(`Could not create invoice with id ${invoiceId}`);
		this.invoiceNumber = invoiceId;
	}
}

export class MakeAnInvoiceCommandHandler implements CommandHandler<MakeAnInvoiceCommand>, Saga.Step {
	constructor(private readonly time: Time, private readonly id: Id, private readonly orders: OrderRepository, private readonly invoices: InvoiceRepository) {
	}

	public async execute(command: MakeAnInvoiceCommand): Promise<Result<InvoicedCreatedForOrder | Error>> {
		const order = await this.orders.getOne(command.content.orderNumber);
		const invoice = new Invoice(this.id.generate(), order, this.time.now());

		try {
			await this.invoices.create(invoice);
			return Result.ok(new InvoicedCreatedForOrder("SEFR", this.time.now(), {
				orderNumber: invoice.getOrderNumber(),
				invoiceNumber: invoice.number,
				emitted: invoice.emitted,
			}));
		} catch (e) {
			return Result.failure(new FailedToCreateInvoice(invoice.number));
		}

	}

	public async compensate(invoiceNumber: string): Promise<void> {
		try {
			await this.invoices.remove(invoiceNumber);
		} catch (e) {
			console.error("Arf");
		}
	}
}
