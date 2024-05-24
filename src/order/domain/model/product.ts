export class Product {
	public readonly name: string;
	public readonly description: string;
	public readonly reference: string;
	public readonly unitPrice: number;

	constructor(name: string, description: string, reference: string, unitPrice: number) {
		this.name = name;
		this.description = description;
		this.reference = reference;
		this.unitPrice = unitPrice;
	}
}
