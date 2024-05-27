import { Product } from "@order/domain/model/product";
import { Result } from "@sefr/result";
import { Saga } from "@shared/saga";

export function main(): Promise<Result<boolean | Error>> {
	const ps4 = new Product("PlayStation 4", "Une console de salon de 4ème génération", "ref-ps4", 250);
	const ps5 = new Product("PlayStation 5", "Une console de salon de 5ème génération", "ref-ps4", 600);
	const orderProducts = new Map<Product, number>();
	orderProducts.set(ps4, 3);
	orderProducts.set(ps5, 2);

	const sagaRunner = new Saga.Runner();

	// Create the order
	// Create associated payment
	// Generate invoice

	return Promise.resolve(Result.failure(new Error("Toto veut un gâteau")));
}
