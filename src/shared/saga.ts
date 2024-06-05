import { Result } from "@sefr/result";
import { Command } from "@shared/command";
import { CommandConstructor } from "@shared/constructor";
import { DomainEvent } from "@shared/domain-event";

type Saga = Array<Saga.Step<Command<unknown>, DomainEvent<unknown> | Saga.CompensationMessage<unknown>>>;

export namespace Saga {
	export interface Step<I extends Command<unknown>, O extends DomainEvent<unknown> | CompensationMessage<unknown>> {
		Command: CommandConstructor<I>;
		execute(command: I): Promise<Result<O>>;
		compensate(input: CompensationMessage<unknown>): Promise<CompensationMessage<unknown>>;
	}

	export class CompensationMessage<T> {
		constructor(public readonly content: T) {
		}
	}

	export class Runner {
		private readonly saga: Saga;

		public constructor() {
			this.saga = [];
		}

		public addStep(step: Saga.Step<Command<unknown>, DomainEvent<unknown> | CompensationMessage<unknown>>): void {
			this.saga.push(step);
		}

		public async start(message: unknown): Promise<void> {
			await this.execute(message, 0);
		}

		private async execute(message: unknown, stepIndex: number): Promise<void> {
			if (!this.hasStepLeft(stepIndex)) return;

			const currentStep = this.saga[stepIndex];
			const command = new currentStep.Command(message);
			const stepResult = await currentStep.execute(command);

			if (stepResult.isFailure) {
				await this.compensate(stepIndex - 1, new CompensationMessage(stepResult.value));
				return;
			}

			const messageForNextStep = (<DomainEvent<unknown>>stepResult.value).getContent();
			await this.execute(messageForNextStep, stepIndex + 1);
		}

		private hasStepLeft(stepIndex: number): boolean {
			return stepIndex <= this.saga.length - 1;
		}

		private async compensate(stepIndex: number, input: CompensationMessage<unknown>): Promise<void> {
			if (stepIndex < 0) return;
			const compensationMessage = await this.saga[stepIndex].compensate(input);
			await this.compensate(stepIndex - 1, compensationMessage);
		}
	}
}
