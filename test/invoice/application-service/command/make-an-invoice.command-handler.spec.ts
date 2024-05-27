import { InvoiceDatasource } from "@datasource/invoice.datasource";
import { OrderDatasource } from "@datasource/order.datasource";
import { MakeAnInvoiceCommand } from "@invoice/application-service/command/make-an-invoice.command";
import { MakeAnInvoiceCommandHandler } from "@invoice/application-service/command/make-an-invoice.command-handler";
import { InvoiceInMemoryRepository } from "@invoice/infrastructure/gateway/repository/invoice-in-memory.repository";
import { InvoiceOrderInMemoryRepository } from "@invoice/infrastructure/gateway/repository/invoice-order-in-memory.repository";
import { StubId } from "@test/double/shared/domain/service/stub.id";
import { StubTime } from "@test/double/shared/domain/service/stub.time";
import { describe, expect, it } from "vitest";
import { InvoiceCreatedForOrder } from "@invoice/domain/event/invoice-created-for-order.event";

const id = new StubId();
const time = new StubTime();
const orderDatasource = new OrderDatasource([]);
const orderRepository = new InvoiceOrderInMemoryRepository(orderDatasource);
const invoiceDatasource = new InvoiceDatasource([]);
const invoiceRepository = new InvoiceInMemoryRepository(invoiceDatasource);
const invoiceNumber = id.generate();
const orderNumber = "D8402B62-DD6F-46AC-A093-DB3A8A3D81FA";
const customerNumber = "D3CD99C9-FEDC-4DAB-A9DE-A5DE1137BBF8";
const makeAnInvoiceCommand = new MakeAnInvoiceCommand({ orderNumber });
const makeAnInvoice = new MakeAnInvoiceCommandHandler(time, id, orderRepository, invoiceRepository);

describe("MakeAnInvoiceCommandHandler", () => {
	describe("when user make an invoice", () => {
		describe("and the order the invoice's for exists", () => {
			it("creates a new invoice for the order", async () => {
				// Given
				await orderDatasource.save({ number: orderNumber, customerNumber, paid: true, products: [] });

				// When
				const result = await makeAnInvoice.execute(makeAnInvoiceCommand);

				// Then
				expect(result.isFailure).to.be.false;
				expect(result.value).to.deep.equal(new InvoiceCreatedForOrder("SEFR", time.now(), { orderNumber, invoiceNumber, emitted: time.now() }));
				const expectedInvoice = await invoiceDatasource.getOne(invoiceNumber);
				expect(expectedInvoice).to.deep.equal({
					number: "332364C3-C90F-4BF8-AF9C-22B97089190E",
					orderNumber: "D8402B62-DD6F-46AC-A093-DB3A8A3D81FA",
					emitted: new Date("2024-01-01T12:00:00.000Z"),
				});
			});
		});
	});
});
