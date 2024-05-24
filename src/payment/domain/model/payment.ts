import { Order } from "@payment/domain/model/order";
import { Result } from "@sefr/result";
import { DomainError } from "@shared/domain-error";

export enum PaymentType {
	ALLOPASS = "Allopass",
	CREDIT_CARD = "Credit Card",
	PAYPAL = "Paypal",
}

export abstract class Payment {
	private readonly number: string;
	private readonly order: Order;

	protected constructor(number: string, order: Order) {
		this.number = number;
		this.order = order;
	}

	abstract proceed(): Result<void | DomainError>;

	public getNumber(): string {
		return this.number;
	}

	public getOrderNumber(): string {
		return this.order.getNumber();
	}
}
