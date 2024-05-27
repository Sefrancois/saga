import { OrderDatasource } from "@datasource/order.datasource";
import { PaymentDatasource } from "@datasource/payment.datasource";
import { Product } from "@order/domain/model/product";
import { PayAnOrderCommand } from "@payment/application-service/command/pay-an-order.command";
import { PayAnOrderCommandHandler } from "@payment/application-service/command/pay-an-order.command-handler";
import { CardExpired } from "@payment/domain/error/card-expired.error";
import { OrderPaidEvent } from "@payment/domain/event/order-paid.event";
import { PaymentType } from "@payment/domain/model/payment";
import { Tuple } from "@shared/tuple";
import { PaymentOrderInMemoryRepository } from "@payment/infrastructure/gateway/repository/payment-order-in-memory.repository";
import { PaymentInMemoryRepository } from "@payment/infrastructure/gateway/repository/payment-in-memory.repository";
import { StubId } from "@test/double/shared/domain/service/stub.id";
import { StubTime } from "@test/double/shared/domain/service/stub.time";
import { describe, expect, it } from "vitest";

const orderNumber = "DFF380FB-0AE5-4A93-A75D-E3D280F86FD1";
const customer = "B681F457-6B9D-48D3-82D7-8D2BD9A01FFB";
const actionMan = new Product("Action-Man : Pompier", "Action-Man the greatest of all heroes", "reference-1", 50);
const products: Array<Tuple<number, Product>> = [[2, actionMan]];
const orderDatasource = new OrderDatasource([]);
const orderRepository = new PaymentOrderInMemoryRepository(orderDatasource);
const paymentDatasource = new PaymentDatasource([]);
const paymentRepository = new PaymentInMemoryRepository(paymentDatasource);
const time = new StubTime();
const id = new StubId();
let payAnOrderCommand = new PayAnOrderCommand({
	orderNumber, paymentType: PaymentType.CREDIT_CARD, paymentInfo: {
		cardNumber: 1234123456785678,
		owner: "SEFR",
		expirationDate: new Date("2025-01-01T13:00:00.000Z"),
		cvc: 123,
	},
});
const payAnOrder = new PayAnOrderCommandHandler(orderRepository, paymentRepository, time, id);

describe("PayAnOrderCommandHandler", () => {
	describe("when user pays an order", () => {
		describe("and the order exists", () => {
			describe("and user pays with credit card", () => {
				describe("and card is not expired", () => {
					it("then pays the order", async () => {
						// Given
						await orderDatasource.save({
							number: orderNumber,
							customerNumber: customer,
							products,
							paid: false,
						});

						// When
						const result = await payAnOrder.execute(payAnOrderCommand);

						// Then
						expect(result.isFailure).to.be.false;
						expect(result.value).to.deep.equal(new OrderPaidEvent("SEFR", time.now(), { orderNumber: payAnOrderCommand.content.orderNumber }));
						const expectedOrder = await orderDatasource.getOne(orderNumber);
						expect(expectedOrder).to.deep.equal({
							number: orderNumber,
							products,
							paid: true,
							customerNumber: customer,
						});
						const expectedPayment = await paymentDatasource.getOne("332364C3-C90F-4BF8-AF9C-22B97089190E");
						expect(expectedPayment).to.deep.equal({
							number: "332364C3-C90F-4BF8-AF9C-22B97089190E",
							orderNumber,
						});
					});
				});

				describe("and card is expired", () => {
					it("then payment fails", async () => {
						// Given
						const paymentInfo = {
							cardNumber: 1234123456785678,
							owner: "SEFR",
							expirationDate: new Date("2023-01-01T13:00:00.000Z"),
							cvc: 123,
						};
						payAnOrderCommand = new PayAnOrderCommand({
							orderNumber,
							paymentType: PaymentType.CREDIT_CARD,
							paymentInfo,
						});
						await orderDatasource.save({
							number: orderNumber,
							customerNumber: customer,
							products,
							paid: false,
						});

						// When
						const result = await payAnOrder.execute(payAnOrderCommand);

						// Then
						expect(result.isFailure).to.be.true;
						expect(result.value).to.deep.equal(new CardExpired(orderNumber, paymentInfo.cardNumber));
					});
				});
			});
		});
	});
});
