import { Product } from "@order/domain/model/product";
import { Tuple } from "@shared/tuple";

export class Order {
	private readonly number: string;
	private readonly customerNumber: string;
	private readonly products: Array<Tuple<number, Product>>;

	constructor(number: string, customer: string, products: Array<Tuple<number, Product>>) {
		this.number = number;
		this.customerNumber = customer;
		this.products = products;
	}

	public getNumber(): string {
		return this.number;
	}

	public getCustomerNumber(): string {
		return this.customerNumber;
	}

	public getProducts(): Array<Tuple<number, Product>> {
		return this.products;
	}
}
