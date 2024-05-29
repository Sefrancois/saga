import { Id } from "@shared/id";

export class StubId implements Id {
	private readonly defaultValue: string;

	constructor() {
		this.defaultValue = "332364C3-C90F-4BF8-AF9C-22B97089190E";
	}

	public generate(): string {
		return this.defaultValue;
	}
}
