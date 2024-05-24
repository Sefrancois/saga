import { PlaceAnOrderCommand } from "@order/application-service/command/place-an-order/place-an-order.command";
import {
	PlaceAnOrderCommandHandler,
} from "@order/application-service/command/place-an-order/place-an-order.command-handler";
import { NoProductInOrderError } from "@order/domain/error/no-product-in-order.error";
import { OrderPlacedEvent } from "@order/domain/event/order-placed.event";
import { Order } from "@order/domain/model/order";
import { Product } from "@order/domain/model/product";
import { Tuple } from "@shared/tuple";
import { StubId } from "@test/double/shared/domain/service/stub.id";
import { StubTime } from "@test/double/shared/domain/service/stub.time";
import { StubOrderRepository } from "@test/double/order/domain/service/stub-order.repository";
import { describe, expect, it } from "vitest";

const customerNumber = "6230246F-8E3F-47EC-BD11-9DD4067016B7";
const date = new Date("2024-01-01T12:00:00.000Z");
const orderNumber = "332364C3-C90F-4BF8-AF9C-22B97089190E";
const actionMan = new Product("Action-Man : Pompier", "Action-Man the greatest of all heroes", "reference-1", 50);
const dune = new Product("Dune : Part One", "Blu-ray Dune : Part One", "reference-2", 25);

describe("PlaceAnOrderCommandHandler", () => {
	describe("when user places an order", () => {
		describe("and there are products inside the cart", () => {
			it("then creates a new order", async () => {
				// Given
				const products: Array<Tuple<number, Product>> = [
					[1, actionMan],
					[2, dune],
				];
				const placeAnOrderCommand = new PlaceAnOrderCommand({
					clientNumber: customerNumber,
					products,
				});
				const time = new StubTime();
				const id = new StubId();
				const orderDomainService = new StubOrderRepository();
				const placeAnOrder = new PlaceAnOrderCommandHandler(time, id, orderDomainService);

				// When
				const result = await placeAnOrder.execute(placeAnOrderCommand);

				// Then
				expect(result.isFailure).to.be.false;
				expect(result.value).to.deep.equal(new OrderPlacedEvent("SEFR", date, { number: orderNumber }));
				expect(orderDomainService.createCallArgs).to.deep.equal(new Order(orderNumber, customerNumber, products));
			});
		});

		describe("and there is no product inside the cart", () => {
			it("then fails", async () => {
				// Given
				const emptyCart: Array<Tuple<number, Product>> = [];
				const placeAnOrderCommand = new PlaceAnOrderCommand({
					clientNumber: customerNumber,
					products: emptyCart,
				});
				const time = new StubTime();
				const id = new StubId();
				const orderDomainService = new StubOrderRepository();
				const placeAnOrder = new PlaceAnOrderCommandHandler(time, id, orderDomainService);

				// When
				const result = await placeAnOrder.execute(placeAnOrderCommand);

				// Then
				expect(result.isFailure).to.be.true;
				expect(result.value).to.be.instanceof(NoProductInOrderError);
				expect(orderDomainService.createCallArgs).to.be.undefined;
			});
		});
	});
});
