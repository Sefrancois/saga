import { Product } from "@order/domain/model/product";
import { Tuple } from "@shared/tuple";

export type OrderEntity = {
	number: string;
	customerNumber?: string;
	products?: Array<Tuple<number, Product>>;
	paid: boolean;
}
