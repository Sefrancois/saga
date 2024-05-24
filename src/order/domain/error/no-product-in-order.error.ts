import { DomainError } from "@shared/domain-error";

export class NoProductInOrderError extends DomainError {
	constructor(orderNumber: string) {
		super(`Unable to create order ${orderNumber} because there was no product inside the cart.`);
	}
}
