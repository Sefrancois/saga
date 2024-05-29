import { Product } from "@order/domain/model/product";
import { Command } from "@shared/command";
import { Tuple } from "@shared/tuple";

export type PlaceAnOrderContent = {
	products: Array<Tuple<number, Product>>;
	clientNumber: string;
}

export class PlaceAnOrderCommand extends Command<PlaceAnOrderContent> {
	constructor(content: PlaceAnOrderContent) {
		super(Symbol("PlaceAnOrderCommand"), content);
	}
}
