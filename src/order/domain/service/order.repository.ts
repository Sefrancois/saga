import { Order } from "@order/domain/model/order";

export interface OrderRepository {
	create(order: Order): Promise<void>;
	remove(orderNumber: number): Promise<void>;
}
