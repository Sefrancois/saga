import { Order } from "@invoice/domain/model/order";

export interface InvoiceOrderRepository {
	getOne(number: string): Promise<Order>;
}
