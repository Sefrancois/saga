import { InvoiceDatasource } from "@datasource/invoice.datasource";
import { OrderDatasource } from "@datasource/order.datasource";
import { PaymentDatasource } from "@datasource/payment.datasource";
import { MakeAnInvoiceCommandHandler } from "@invoice/application-service/command/make-an-invoice.command-handler";
import { InvoiceCreatedForOrder } from "@invoice/domain/event/invoice-created-for-order.event";
import { InvoiceRepository } from "@invoice/domain/service/invoice.repository";
import { InvoiceOrderRepository } from "@invoice/domain/service/invoice-order.repository";
import { InvoiceInMemoryRepository } from "@invoice/infrastructure/gateway/repository/invoice-in-memory.repository";
import {
	InvoiceOrderInMemoryRepository,
} from "@invoice/infrastructure/gateway/repository/invoice-order-in-memory.repository";
import {
	PlaceAnOrderCommandHandler,
} from "@order/application-service/command/place-an-order/place-an-order.command-handler";
import { OrderRepository } from "@order/domain/service/order.repository";
import { OrderInMemoryRepository } from "@order/infrastructure/gateway/repository/order-in-memory.repository";
import { PayAnOrderCommandHandler } from "@payment/application-service/command/pay-an-order.command-handler";
import { OrderRepository as PaymentOrderRepository } from "@payment/domain/service/order.repository";
import { PaymentRepository } from "@payment/domain/service/payment.repository";
import { PaymentInMemoryRepository } from "@payment/infrastructure/gateway/repository/payment-in-memory.repository";
import {
	PaymentOrderInMemoryRepository,
} from "@payment/infrastructure/gateway/repository/payment-order-in-memory.repository";
import { Saga } from "@shared/saga";
import { StubId } from "@test/double/shared/domain/service/stub.id";
import { StubTime } from "@test/double/shared/domain/service/stub.time";
import { beforeAll, describe, expect, it } from "vitest";

let time: StubTime;
let id: StubId;

let orderDatasource: OrderDatasource;
let paymentDatasource: PaymentDatasource;
let invoiceDatasource: InvoiceDatasource;

let orderRepository: OrderRepository;
let paymentOrderRepository: PaymentOrderRepository;
let invoiceOrderRepository: InvoiceOrderRepository;
let paymentRepository: PaymentRepository;
let invoiceRepository: InvoiceRepository;

let placeAnOrderCommandHandler: PlaceAnOrderCommandHandler;
let payAnOrderCommandHandler: PayAnOrderCommandHandler;
let makeAnInvoiceCommandHandler: MakeAnInvoiceCommandHandler;
let sagaRunner: Saga.Runner;

describe("Saga.Runner", () => {
	beforeAll(() => {
		time = new StubTime();
		id = new StubId();

		orderDatasource = new OrderDatasource([]);
		paymentDatasource = new PaymentDatasource([]);
		invoiceDatasource = new InvoiceDatasource([]);

		orderRepository = new OrderInMemoryRepository(orderDatasource);
		paymentOrderRepository = new PaymentOrderInMemoryRepository(orderDatasource);
		invoiceOrderRepository = new InvoiceOrderInMemoryRepository(orderDatasource);

		paymentRepository = new PaymentInMemoryRepository(paymentDatasource);

		invoiceRepository = new InvoiceInMemoryRepository(invoiceDatasource);

		placeAnOrderCommandHandler = new PlaceAnOrderCommandHandler(time, id, orderRepository);
		payAnOrderCommandHandler = new PayAnOrderCommandHandler(paymentOrderRepository, paymentRepository, time, id);
		makeAnInvoiceCommandHandler = new MakeAnInvoiceCommandHandler(time, id, invoiceOrderRepository, invoiceRepository);
		sagaRunner = new Saga.Runner();

		sagaRunner.addStep(placeAnOrderCommandHandler);
		sagaRunner.addStep(payAnOrderCommandHandler);
		sagaRunner.addStep(makeAnInvoiceCommandHandler);
	});

	describe("when user place an order", () => {
		it("then it places an order, ensure the payment is successful and the invoice has been created", async () => {
			// Given

			// When
			const result = await sagaRunner.execute();

			// Then
			expect(result).to.deep.equal(new InvoiceCreatedForOrder("SEFR", new Date("2024-01-01T12:00:00.000Z"), {
				orderNumber: "order-1",
				emitted: new Date("2024-01-01T12:00:00.000Z"),
				invoiceNumber: "invoice-1",
			}));
		});
	});
});
