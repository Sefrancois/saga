import { Order } from "@payment/domain/model/order";

export interface OrderRepository {
	getOne(orderNumber: string): Promise<Order>;
	save(order: Order): Promise<void>;
}
