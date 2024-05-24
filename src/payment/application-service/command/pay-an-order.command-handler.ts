import { PayAnOrderCommand } from "@payment/application-service/command/pay-an-order.command";
import { CardExpiredError } from "@payment/domain/error/card-expired.error";
import { OrderPaidEvent } from "@payment/domain/event/order-paid.event";
import { OrderRepository } from "@payment/domain/service/order.repository";
import { PaymentFactory } from "@payment/domain/service/payment.factory";
import { PaymentRepository } from "@payment/domain/service/payment.repository";
import { Result } from "@sefr/result";
import { CommandHandler } from "@shared/command";
import { DomainError } from "@shared/domain-error";
import { Id } from "@shared/id";
import { Saga } from "@shared/saga";
import { Time } from "@shared/time";

export class PayAnOrderCommandHandler implements CommandHandler<PayAnOrderCommand>, Saga.Step {
    constructor(private readonly orders: OrderRepository, private readonly payments: PaymentRepository, private readonly time: Time, private readonly id: Id) {
    }

    public async execute(command: PayAnOrderCommand): Promise<Result<OrderPaidEvent | CardExpiredError>> {
        const order = await this.orders.getOne(command.content.orderNumber);
        const payment = PaymentFactory.create(this.id.generate(), order, command.content.paymentType, command.content.paymentInfo);
        const isPaymentProceeded = payment.proceed();

        if (isPaymentProceeded.isFailure) {
            return Result.failure(<DomainError> isPaymentProceeded.value);
        }

        await this.orders.save(order);
        await this.payments.save(payment);
        return Result.ok(new OrderPaidEvent("SEFR", this.time.now(), { orderNumber: command.content.orderNumber }));
    }

    public async compensate(...args: unknown[]): Promise<void> {
        return Promise.resolve(undefined);
    }
}
