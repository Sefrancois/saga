import { PaymentDatasource } from "@datasource/payment.datasource";
import { Payment } from "@payment/domain/model/payment";
import { PaymentRepository } from "@payment/domain/service/payment.repository";

export class StubPaymentRepository implements PaymentRepository {
	constructor(private readonly paymentDatasource: PaymentDatasource) {
	}

	public async save(payment: Payment): Promise<void> {
		await this.paymentDatasource.save({ number: payment.getNumber(), orderNumber: payment.getOrderNumber() });
	}
}
