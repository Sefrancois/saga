import { OrderDatasource } from "@datasource/order.datasource";
import { Order } from "@invoice/domain/model/order";
import { InvoiceOrderRepository } from "@invoice/domain/service/invoice-order.repository";

export class InvoiceOrderInMemoryRepository implements InvoiceOrderRepository {
	constructor(private readonly orderDatasource: OrderDatasource) {
	}

	public getOne(number: string): Promise<Order> {
		return this.orderDatasource.getOne(number);
	}
}
