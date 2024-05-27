import { Order } from "@order/domain/model/order";
import { OrderRepository } from "@order/domain/service/order.repository";

export class StubOrderRepository implements OrderRepository {
	private _createCallArgs: Order | undefined;

	public async create(order: Order): Promise<void> {
		this._createCallArgs = order;
		return Promise.resolve();
	}

	public get createCallArgs(): Order | undefined {
		return this._createCallArgs;
	}

	public remove(orderNumber: string): Promise<void> {
		return Promise.resolve(undefined);
	}
}
