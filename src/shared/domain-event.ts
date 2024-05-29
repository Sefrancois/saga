export abstract class DomainEvent<T> {
	protected author: string;
	protected emitted: Date;
	protected content: T;

	protected constructor(author: string, emitted: Date, content: T) {
		this.author = author;
		this.emitted = emitted;
		this.content = content;
	}

	public getAuthor(): string {
		return this.author;
	}

	public getEmitted(): Date {
		return this.emitted;
	}

	public getContent(): T {
		return this.content;
	}
}
