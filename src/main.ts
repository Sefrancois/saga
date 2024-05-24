import { Result } from "@sefr/result";
import { Saga } from "@shared/saga";

export function main(): Promise<Result<boolean | Error>> {
	const sagaRunner = new Saga.Runner();

	return Promise.resolve(Result.failure(new Error("Toto veut un gâteau")));
}
