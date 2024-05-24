import { Order } from "@payment/domain/model/order";
import { Payment } from "@payment/domain/model/payment";
import { Result } from "@sefr/result";

export type PaypalInformations = {
	accountNumber: number;
}

export class PaypalPayment extends Payment {
	private readonly paypalInformations: PaypalInformations;

	constructor(number: string, order: Order, paypalInformations: PaypalInformations) {
		super(number, order);
		this.paypalInformations = paypalInformations;
	}

	public proceed(): Result<void> {
        this.order.pay();
		return Result.ok();
    }
}
