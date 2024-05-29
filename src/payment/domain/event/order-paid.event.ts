import { DomainEvent } from "@shared/domain-event";

type OrderPaidContent = {
	orderNumber: string;
};

export class OrderPaidEvent extends DomainEvent<OrderPaidContent>{
	constructor(author: string, emitted: Date, content: OrderPaidContent) {
		super(author, emitted, content);
	}
}
