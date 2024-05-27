import { Payment } from "@payment/domain/model/payment";

export interface PaymentRepository {
	save(payment: Payment): Promise<void>;
	cancel(paymentNumber: string): Promise<void>;
}
