import { Product } from "@order/domain/model/product";
import { Command } from "@shared/command";

type PlaceAnOrderContent = {
	products: Array<[number, Product]>;
	clientNumber: string;
}

export class PlaceAnOrderCommand extends Command<PlaceAnOrderContent> {
	constructor(content: PlaceAnOrderContent) {
		super(Symbol("PlaceAnOrderCommand"), content);
	}
}
