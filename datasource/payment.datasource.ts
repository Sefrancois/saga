import { PaymentEntity } from "@datasource/entity/payment.entity";

export class PaymentDatasource {
	private readonly payments: Array<PaymentEntity>;

	constructor(payments: Array<PaymentEntity>) {
		this.payments = payments;
	}

	public getOne(paymentNumber: string): Promise<PaymentEntity> {
		const payment = this.payments.find((payment) => payment.number === paymentNumber);
		if (payment) return Promise.resolve(payment);
		else throw new Error("Cannot find existing order or create new order without order number.");
	}

	public save(payment: Partial<PaymentEntity>): Promise<void> {
		if (payment.number) {
			const indexOfExistingOrder = this.payments.findIndex((orderEntity) => orderEntity.number === payment.number);

			if (indexOfExistingOrder >= 0) {
				this.payments[indexOfExistingOrder] = { ...this.payments[indexOfExistingOrder], ...payment };
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
}
