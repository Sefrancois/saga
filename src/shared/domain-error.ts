export abstract class DomainError<T> extends Error {
	public readonly content: T | undefined;

	protected constructor(message: string, content?: T) {
		super(message);
		this.content = content;
	}
}
