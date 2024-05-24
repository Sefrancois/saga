import { Order } from "@payment/domain/model/order";
import { Payment } from "@payment/domain/model/payment";
import { Result } from "@sefr/result";

export type PhoneInformations = {
	phoneNumber: string;
	operator: string;
}

export class AllopassPayment extends Payment {
	private readonly phoneInformations: PhoneInformations;

	constructor(number: string, order: Order, phoneInformations: PhoneInformations) {
		super(number, order);
		this.phoneInformations = phoneInformations;
	}

	public proceed(): Result<void> {
        this.order.pay();
		return Result.ok();
    }
}
