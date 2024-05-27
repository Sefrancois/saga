import { DomainError } from "@shared/domain-error";

export class PaymentFailed extends DomainError {
	public readonly orderNumber: string;

	constructor(orderNumber: string, reason: string) {
		super(`Failed payment for order ${orderNumber} because ${reason}`);
		this.orderNumber = orderNumber;
	}
}
