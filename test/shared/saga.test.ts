import { InvoiceDatasource } from "@datasource/invoice.datasource";
import { OrderDatasource } from "@datasource/order.datasource";
import { PaymentDatasource } from "@datasource/payment.datasource";
import { MakeAnInvoiceCommand } from "@invoice/application-service/command/make-an-invoice.command";
import { MakeAnInvoiceCommandHandler } from "@invoice/application-service/command/make-an-invoice.command-handler";
import { FailedToCreateInvoice } from "@invoice/domain/error/failed-to-create-invoice.error";
import { InvoiceCreatedForOrder } from "@invoice/domain/event/invoice-created-for-order.event";
import { InvoiceRepository } from "@invoice/domain/service/invoice.repository";
import { InvoiceOrderRepository } from "@invoice/domain/service/invoice-order.repository";
import { InvoiceInMemoryRepository } from "@invoice/infrastructure/gateway/repository/invoice-in-memory.repository";
import {
	InvoiceOrderInMemoryRepository,
} from "@invoice/infrastructure/gateway/repository/invoice-order-in-memory.repository";
import { PlaceAnOrderContent } from "@order/application-service/command/place-an-order/place-an-order.command";
import {
	PlaceAnOrderCommandHandler,
} from "@order/application-service/command/place-an-order/place-an-order.command-handler";
import { Product } from "@order/domain/model/product";
import { OrderRepository } from "@order/domain/service/order.repository";
import { OrderInMemoryRepository } from "@order/infrastructure/gateway/repository/order-in-memory.repository";
import { PayAnOrderCommand } from "@payment/application-service/command/pay-an-order.command";
import { PayAnOrderCommandHandler } from "@payment/application-service/command/pay-an-order.command-handler";
import { CardExpired } from "@payment/domain/error/card-expired.error";
import { PaymentFailed } from "@payment/domain/error/payment-failed.error";
import { OrderPaidEvent } from "@payment/domain/event/order-paid.event";
import { OrderRepository as PaymentOrderRepository } from "@payment/domain/service/order.repository";
import { PaymentRepository } from "@payment/domain/service/payment.repository";
import { PaymentInMemoryRepository } from "@payment/infrastructure/gateway/repository/payment-in-memory.repository";
import {
	PaymentOrderInMemoryRepository,
} from "@payment/infrastructure/gateway/repository/payment-order-in-memory.repository";
import { Result } from "@sefr/result";
import { Id } from "@shared/id";
import { Saga } from "@shared/saga";
import { Time } from "@shared/time";
import { Tuple } from "@shared/tuple";
import { StubId } from "@test/double/shared/domain/service/stub.id";
import { StubTime } from "@test/double/shared/domain/service/stub.time";
import { beforeEach, describe, expect, it } from "vitest";

const ps4 = new Product("PlayStation 4", "Une console de salon de 4ème génération", "ref-ps4", 250);
const ps5 = new Product("PlayStation 5", "Une console de salon de 5ème génération", "ref-ps4", 600);

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
	beforeEach(() => {
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
		describe("and all steps are ok", () => {
			it("then it places an order, ensure the payment is successful and ensure the invoice has been created", async () => {
				// Given
				const initialCommand = createAnOrderContent();

				// When
				await sagaRunner.start(initialCommand);

				// Then
				const expectedOrderId = "332364C3-C90F-4BF8-AF9C-22B97089190E";
				const expectedPaymentId = "332364C3-C90F-4BF8-AF9C-22B97089190E";
				const expectedInvoiceId = "332364C3-C90F-4BF8-AF9C-22B97089190E";

				const expectedOrder = {
					customerNumber: "clientNumber",
					number: "332364C3-C90F-4BF8-AF9C-22B97089190E",
					paid: true,
					products: [[3, ps4], [3, ps5]],
				};
				const expectedPayment = {
					number: "332364C3-C90F-4BF8-AF9C-22B97089190E",
					orderNumber: "332364C3-C90F-4BF8-AF9C-22B97089190E",
				};
				const expectedInvoice = {
					emitted: new Date("2024-01-01T12:00:00.000Z"),
					number: "332364C3-C90F-4BF8-AF9C-22B97089190E",
					orderNumber: "332364C3-C90F-4BF8-AF9C-22B97089190E",
				};

				expect(await orderDatasource.getOne(expectedOrderId)).to.deep.equal(expectedOrder);
				expect(await paymentDatasource.getOne(expectedPaymentId)).to.deep.equal(expectedPayment);
				expect(await invoiceDatasource.getOne(expectedInvoiceId)).to.deep.equal(expectedInvoice);
			});
		});

		describe("and the payment fails", () => {
			beforeEach(() => {
				payAnOrderCommandHandler = new FakePayAnOrderCommandHandler(paymentOrderRepository, paymentRepository, time, id);
				sagaRunner = new Saga.Runner();
				sagaRunner.addStep(placeAnOrderCommandHandler);
				sagaRunner.addStep(payAnOrderCommandHandler);
				sagaRunner.addStep(makeAnInvoiceCommandHandler);
			});

			it("then it compensates by deleting the order", async () => {
				// Given
				const initialCommand = createAnOrderContent();

				// When
				await sagaRunner.start(initialCommand);

				// Then
				expect(await orderDatasource.getAll()).to.be.empty;
			});
		});

		describe("and the invoice creation fails", () => {
			beforeEach(() => {
				makeAnInvoiceCommandHandler = new FakeMakeAnInvoiceCommandHandler(time, id, invoiceOrderRepository, invoiceRepository);
				sagaRunner = new Saga.Runner();
				sagaRunner.addStep(placeAnOrderCommandHandler);
				sagaRunner.addStep(payAnOrderCommandHandler);
				sagaRunner.addStep(makeAnInvoiceCommandHandler);
			});

			it("then it compensates by deleting the order and the payment", async () => {
				// Given
				const initialCommand = createAnOrderContent();

				// When
				await sagaRunner.start(initialCommand);

				// Then
				expect(await orderDatasource.getAll()).to.be.empty;
				expect(await paymentDatasource.getAll()).to.be.empty;
			});
		});
	});

});

function createAnOrderContent(): PlaceAnOrderContent {
	const ps4Line: Tuple<number, Product> = [3, ps4];
	const ps5Line: Tuple<number, Product> = [3, ps5];
	const orderProducts: Array<Tuple<number, Product>> = [ps4Line, ps5Line];

	return {
		clientNumber: "clientNumber",
		products: orderProducts,
	};
}

class FakePayAnOrderCommandHandler extends PayAnOrderCommandHandler {
	constructor(orders: PaymentOrderRepository, payments: PaymentRepository, time: Time, id: Id) {
		super(orders, payments, time, id);
	}

	public async execute(command: PayAnOrderCommand): Promise<Result<OrderPaidEvent | PaymentFailed>> {
		const order = await this.orders.getOne(command.content.number);
		return Result.failure(new CardExpired(order.getNumber(), 1111222233334444));
	}
}

class FakeMakeAnInvoiceCommandHandler extends MakeAnInvoiceCommandHandler {
	public execute(command: MakeAnInvoiceCommand): Promise<Result<InvoiceCreatedForOrder | FailedToCreateInvoice>> {
		return Promise.resolve(Result.failure(new FailedToCreateInvoice(command.content.orderNumber)));
	}
}
