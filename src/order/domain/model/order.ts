import { Product } from "@order/domain/model/product";
import { Tuple } from "@shared/tuple";

export class Order {
	private readonly _number: string;
	private readonly _customerNumber: string;
	private readonly _products: Array<Tuple<number, Product>>;

	constructor(number: string, customer: string, products: Array<Tuple<number, Product>>) {
		this._number = number;
		this._customerNumber = customer;
		this._products = products;
	}

	public get number(): string {
		return this._number;
	}

	public get customerNumber(): string {
		return this._customerNumber;
	}

	public get products(): Array<Tuple<number, Product>> {
		return this._products;
	}
}
