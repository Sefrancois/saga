import { DomainError } from "@shared/domain-error";

export class NoProductInOrderError extends DomainError<{ orderNumber: string }> {
	constructor(orderNumber: string) {
		super(`Unable to create order ${orderNumber} because there was no product inside the cart.`, { orderNumber });
	}
}
