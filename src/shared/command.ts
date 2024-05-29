import { Result } from "@sefr/result";
import { DomainError } from "@shared/domain-error";
import { DomainEvent } from "@shared/domain-event";

export abstract class Command<T> {
	protected name: symbol;
	public readonly content: T;

	protected constructor(name: symbol, content: T) {
		this.name = name;
		this.content = content;
	}

	public getName(): symbol {
		return this.name;
	}
}

export interface CommandHandler<T extends Command<unknown>> {
	execute(command: T): Promise<Result<DomainEvent<unknown> | DomainError<unknown>>>;
}
