export class Order {
	private readonly number: string;
	private paid: boolean;

	constructor(number: string, paid: boolean) {
		this.number = number;
		this.paid = paid;
	}

	public getNumber(): string {
		return this.number;
	}

	public getPaid(): boolean {
		return this.paid;
	}

	public pay(): void {
		this.paid = true;
	}
}
