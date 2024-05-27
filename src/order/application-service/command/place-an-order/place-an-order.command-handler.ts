import { PlaceAnOrderCommand } from "@order/application-service/command/place-an-order/place-an-order.command";
import { NoProductInOrderError } from "@order/domain/error/no-product-in-order.error";
import { OrderPlacedEvent } from "@order/domain/event/order-placed.event";
import { Order } from "@order/domain/model/order";
import { OrderRepository } from "@order/domain/service/order.repository";
import { Result } from "@sefr/result";
import { CommandHandler } from "@shared/command";
import { Id } from "@shared/id";
import { Saga } from "@shared/saga";
import { Time } from "@shared/time";

export class PlaceAnOrderCommandHandler implements CommandHandler<PlaceAnOrderCommand>, Saga.Step {
    constructor(private readonly time: Time, private readonly id: Id, private readonly orders: OrderRepository) {
    }

    public async execute(command: PlaceAnOrderCommand): Promise<Result<OrderPlacedEvent | NoProductInOrderError>> {
        const orderNumber = this.id.generate();
        if (PlaceAnOrderCommandHandler.orderHasProducts(command)) {
            return Result.failure(new NoProductInOrderError(orderNumber));
        }
        await this.orders.create(new Order(orderNumber, command.content.clientNumber, command.content.products));
        return Result.ok(new OrderPlacedEvent("SEFR", this.time.now(), { number: orderNumber }));
    }

    public async compensate(orderNumber: string): Promise<void> {
        try {
            await this.orders.remove(orderNumber);
        } catch(e) {
            console.log("Arf");
        }
    }

    private static orderHasProducts(command: PlaceAnOrderCommand): boolean {
        return command.content.products.length === 0;
    }
}
