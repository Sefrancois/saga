import { PaymentFailed } from "@payment/domain/error/payment-failed.error";

export class CardExpired extends PaymentFailed {
	constructor(orderNumber: string, cardNumber: number) {
		super(orderNumber, `card ${cardNumber} is expired.`);
	}
}
