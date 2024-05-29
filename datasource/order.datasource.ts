import { OrderEntity } from "@datasource/entity/order.entity";

export class OrderDatasource {
	private readonly orders: Array<OrderEntity>;

	constructor(orders: Array<OrderEntity>) {
		this.orders = orders;
	}

	public save(partialOrder: Partial<OrderEntity>): Promise<void> {
		if (partialOrder.number) {
			const indexOfExistingOrder = this.orders.findIndex((orderEntity) => orderEntity.number === partialOrder.number);

			if (indexOfExistingOrder >= 0) {
				this.orders[indexOfExistingOrder] = { ...this.orders[indexOfExistingOrder], ...partialOrder };
				return Promise.resolve();
			}
			this.orders.push({ number: partialOrder.number, products: partialOrder.products, customerNumber: partialOrder.customerNumber, paid: partialOrder.paid || false });
		} else {
			throw new Error("Cannot find existing order or create new order without order number.");
		}
		return Promise.resolve();
	}

	public getOne(orderNumber: string): Promise<OrderEntity> {
		const order = this.orders.find((order) => order.number === orderNumber);
		if (order) return Promise.resolve(order);
		else throw new Error("Cannot find existing order or create new order without order number.");
	}

	public remove(orderNumber: string): Promise<void> {
		const indexOfOrder = this.orders.findIndex((orderEntity) => orderEntity.number === orderNumber);
		this.orders.splice(indexOfOrder, 1);
		return Promise.resolve();
	}

	public getAll(): Promise<Array<OrderEntity>> {
		return Promise.resolve(this.orders);
	}
}
