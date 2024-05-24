import { DomainError } from "@shared/domain-error";

export class CardExpiredError extends DomainError {
	constructor(cardNumber: number) {
		super(`Card ${cardNumber} is expired.`);
	}
}
