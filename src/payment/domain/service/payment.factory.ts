import { AllopassPayment, PhoneInformations } from "@payment/domain/model/allopass-payment";
import { CardInformations, CreditCardPayment } from "@payment/domain/model/credit-card-payment";
import { Order } from "@payment/domain/model/order";
import { Payment, PaymentType } from "@payment/domain/model/payment";
import { PaypalInformations, PaypalPayment } from "@payment/domain/model/paypal-payment";

export class PaymentFactory {
	public static create<T>(number: string, order: Order, paymentType: PaymentType, paymentInfo: T): Payment {
		if (paymentType === PaymentType.CREDIT_CARD) {
			return new CreditCardPayment(number, order, paymentInfo as CardInformations);
		} else if (paymentType === PaymentType.ALLOPASS) {
			return new AllopassPayment(number, order, paymentInfo as PhoneInformations);
		} else {
			return new PaypalPayment(number, order, paymentInfo as PaypalInformations);
		}
	}
}
