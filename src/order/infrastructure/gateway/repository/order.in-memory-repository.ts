import { OrderDatasource } from "@datasource/order.datasource";
import { Order } from "@order/domain/model/order";
import { OrderRepository } from "@order/domain/service/order.repository";

export class OrderInMemoryRepository implements OrderRepository {
	constructor(private readonly orderDatasource: OrderDatasource) {
	}

	public async create(order: Order): Promise<void> {
        await this.orderDatasource.save({ ...order, paid: false });
    }
}
