import { PayAnOrderCommand } from "@payment/application-service/command/pay-an-order.command";
import { PaymentFailed } from "@payment/domain/error/payment-failed.error";
import { OrderPaidEvent } from "@payment/domain/event/order-paid.event";
import { OrderRepository } from "@payment/domain/service/order.repository";
import { PaymentFactory } from "@payment/domain/service/payment.factory";
import { PaymentRepository } from "@payment/domain/service/payment.repository";
import { Result } from "@sefr/result";
import { CommandHandler } from "@shared/command";
import { Id } from "@shared/id";
import { Saga } from "@shared/saga";
import { Time } from "@shared/time";

export class PayAnOrderCommandHandler implements CommandHandler<PayAnOrderCommand>, Saga.Step<PayAnOrderCommand, OrderPaidEvent | PaymentFailed> {
    public readonly Command = PayAnOrderCommand;

    constructor(protected readonly orders: OrderRepository, private readonly payments: PaymentRepository, private readonly time: Time, protected readonly id: Id) {
    }

    public async execute(command: PayAnOrderCommand): Promise<Result<OrderPaidEvent | PaymentFailed>> {
        const order = await this.orders.getOne(command.content.number);
        const payment = PaymentFactory.create(this.id.generate(), order, command.content.paymentType, command.content.paymentInfo);
        const isPaymentProceeded = payment.proceed();

        if (isPaymentProceeded.isFailure) {
            return Result.failure(<PaymentFailed> isPaymentProceeded.value);
        }

        await this.orders.save(order);
        await this.payments.save(payment);
        return Result.ok(new OrderPaidEvent("SEFR", this.time.now(), { orderNumber: command.content.number }));
    }

    public async compensate(input: Saga.CompensationMessage<{ orderNumber: string }>): Promise<Saga.CompensationMessage<{ orderNumber: string }>> {
        try {
            await this.payments.cancel(input.content.orderNumber);
            return input;
        } catch(e) {
            console.error("Arf");
            throw new Error();
        }
    }
}
