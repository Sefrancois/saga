import { describe, expect, it } from "vitest";

import { main } from "../src/main";

describe("main", () => {
	it("executes successfully the saga", async () => {
		// Given

		// When
		const result = await main();

		// Then
		expect(result.isFailure).to.be.false;
	});
});
