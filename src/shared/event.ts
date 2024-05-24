export abstract class DomainEvent<T> {
	protected _author: string;
	protected _emitted: Date;
	protected _content: T;

	protected constructor(author: string, emitted: Date, content: T) {
		this._author = author;
		this._emitted = emitted;
		this._content = content;
	}

	public get author(): string {
		return this._author;
	}

	public get emitted(): Date {
		return this._emitted;
	}

	public get content(): T {
		return this._content;
	}
}
