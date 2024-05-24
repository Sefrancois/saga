import { OrderDatasource } from "@datasource/order.datasource";
import { Order } from "@invoice/domain/model/order";
import { OrderRepository } from "@invoice/domain/service/order.repository";

export class StubOrderRepository implements OrderRepository {
	constructor(private readonly orderDatasource: OrderDatasource) {
	}

	public getOne(number: string): Promise<Order> {
		return this.orderDatasource.getOne(number);
	}
}
