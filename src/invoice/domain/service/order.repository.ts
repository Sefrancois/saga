import { Order } from "@invoice/domain/model/order";

export interface OrderRepository {
	getOne(number: string): Promise<Order>;
}
