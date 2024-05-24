import { OrderDatasource } from "@datasource/order.datasource";
import { Order } from "@payment/domain/model/order";
import { OrderRepository } from "@payment/domain/service/order.repository";

export class StubOrderRepository implements OrderRepository {
	constructor(private readonly orderDatasource: OrderDatasource) {
	}

	public async getOne(orderNumber: string): Promise<Order> {
		const order = await this.orderDatasource.getOne(orderNumber);
        return new Order(order.number, order.paid);
    }

    public async save(order: Order): Promise<void> {
        await this.orderDatasource.save(order);
    }
}
