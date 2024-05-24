import { PaymentType } from "@payment/domain/model/payment";
import { Command } from "@shared/command";

type PayAnOrderContent<T> = {
	orderNumber: string;
	paymentType: PaymentType;
	paymentInfo: T
};

export class PayAnOrderCommand extends Command<PayAnOrderContent<unknown>> {
	constructor(content: PayAnOrderContent<unknown>) {
		super(Symbol("PayAnOrderCommand"), content);
	}
}
