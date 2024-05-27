import { CardExpired } from "@payment/domain/error/card-expired.error";
import { Order } from "@payment/domain/model/order";
import { Payment } from "@payment/domain/model/payment";
import { Result } from "@sefr/result";

export type CardInformations = {
	cardNumber: number;
	owner: string;
	expirationDate: Date;
	cvc: number;
}

export class CreditCardPayment extends Payment {
	private readonly cardInformations: CardInformations;

	constructor(number: string, order: Order, cardInformations: CardInformations) {
		super(number, order);
		this.cardInformations = cardInformations;
	}

	public proceed(): Result<void | CardExpired> {
		if (this.cardInformations.expirationDate.getTime() < Date.now()) {
			return Result.failure(new CardExpired(this.order.getNumber(), this.cardInformations.cardNumber));
		}
        this.order.pay();
		return Result.ok();
    }
}
