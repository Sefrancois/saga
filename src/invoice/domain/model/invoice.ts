import { Order } from "@invoice/domain/model/order";

export class Invoice {
	public readonly number: string;
	public readonly order: Order;
	public readonly emitted: Date;

	constructor(number: string, order: Order, emitted: Date) {
		this.number = number;
		this.order = order;
		this.emitted = emitted;
	}

	public getOrderNumber(): string {
		return this.order.number;
	}
}
