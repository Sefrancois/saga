import { PaymentFailed } from "@payment/domain/error/payment-failed.error";
import { Order } from "@payment/domain/model/order";
import { Result } from "@sefr/result";

export enum PaymentType {
	ALLOPASS = "Allopass",
	CREDIT_CARD = "Credit Card",
	PAYPAL = "Paypal",
}

export abstract class Payment {
	protected readonly number: string;
	protected readonly order: Order;

	protected constructor(number: string, order: Order) {
		this.number = number;
		this.order = order;
	}

	abstract proceed(): Result<void | PaymentFailed>;

	public getNumber(): string {
		return this.number;
	}

	public getOrderNumber(): string {
		return this.order.getNumber();
	}
}
