import { DomainError } from "@shared/domain-error";

export class PaymentFailed extends DomainError<{ orderNumber: string }> {
	constructor(orderNumber: string, reason: string) {
		super(`Failed payment for order ${orderNumber} because ${reason}`, { orderNumber });
	}
}
