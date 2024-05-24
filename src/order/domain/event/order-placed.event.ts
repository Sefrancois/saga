import { DomainEvent } from "@shared/event";

type OrderPlacedContent = {
	number: string;
}

export class OrderPlacedEvent extends DomainEvent<OrderPlacedContent> {
	constructor(author: string, emitted: Date, content: OrderPlacedContent) {
		super(author, emitted, content);
	}
}
