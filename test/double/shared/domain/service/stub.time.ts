import { Time } from "@shared/time";

export class StubTime implements Time {
	public now(): Date {
		return new Date("2024-01-01T12:00:00.000Z");
	}
}
