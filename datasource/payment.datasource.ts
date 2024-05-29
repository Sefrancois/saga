import { PaymentEntity } from "@datasource/entity/payment.entity";

export class PaymentDatasource {
	private readonly payments: Array<PaymentEntity>;

	constructor(payments: Array<PaymentEntity>) {
		this.payments = payments;
	}

	public getOne(paymentNumber: string): Promise<PaymentEntity> {
		const payment = this.payments.find((payment) => payment.number === paymentNumber);
		if (payment) return Promise.resolve(payment);
		else throw new Error("Cannot find existing payment or create new payment without payment number.");
	}

	public getAll(): Promise<Array<PaymentEntity>> {
		return Promise.resolve(this.payments);
	}

	public save(payment: Partial<PaymentEntity>): Promise<void> {
		if (payment.number) {
			const indexOfExistingPayment = this.payments.findIndex((paymentEntity) => paymentEntity.number === payment.number);

			if (indexOfExistingPayment >= 0) {
				this.payments[indexOfExistingPayment] = { ...this.payments[indexOfExistingPayment], ...payment };
				return Promise.resolve();
			}

			if (payment.orderNumber) {
				this.payments.push({ number: payment.number, orderNumber: payment.orderNumber });
			} else {
				throw new Error("Cannot create new payment without order number.");
			}
		} else {
			throw new Error("Cannot create new payment without payment number.");
		}
		return Promise.resolve();
	}

	public remove(orderNumber: string): Promise<void> {
		const indexOfExistingPaymentForOrder = this.payments.findIndex((paymentEntity) => paymentEntity.orderNumber === orderNumber);
		this.payments.splice(indexOfExistingPaymentForOrder, 1);
		return Promise.resolve();
	}
}
