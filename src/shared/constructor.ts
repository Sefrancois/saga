import { Command } from "@shared/command";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CommandConstructor<T extends Command<unknown>> = new (content: any) => T;
