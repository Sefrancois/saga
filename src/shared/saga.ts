import { Result } from "@sefr/result";
import { Command } from "@shared/command";
import { CommandConstructor } from "@shared/constructor";
import { DomainEvent } from "@shared/domain-event";

type Saga = Array<Saga.Step<Command<unknown>, DomainEvent<unknown> | Saga.CompensationMessage<unknown>>>;

export namespace Saga {
	export interface Step<I extends Command<unknown>, O extends DomainEvent<unknown> | CompensationMessage<unknown>> {
		Command: CommandConstructor<I>;
		execute(command: Command<unknown>): Promise<Result<O>>;
		compensate(input: CompensationMessage<unknown>): Promise<CompensationMessage<unknown>>;
	}

	export class CompensationMessage<T> {
		constructor(public readonly content: T) {
		}
	}

	export class Runner {
		private readonly saga: Saga;
		private currentSagaStepIndex: number;

		public constructor() {
			this.saga = [];
			this.currentSagaStepIndex = 0;
		}

		public addStep(step: Saga.Step<Command<unknown>, DomainEvent<unknown> | CompensationMessage<unknown>>): void {
			this.saga.push(step);
		}

		public async execute(initialMessage: unknown): Promise<void> {
			let commandCreatedFromMessage: Command<unknown>;
			let messageForNextStep = initialMessage;

			while (this.hasStepLeft()) {
				const currentStep = this.saga[this.currentSagaStepIndex];
				commandCreatedFromMessage = new currentStep.Command(messageForNextStep);
				const stepResult = await currentStep.execute(commandCreatedFromMessage);

				if (stepResult.isFailure) {
					const previousStepIndex = this.currentSagaStepIndex - 1;
					await this.compensate(previousStepIndex, new CompensationMessage(stepResult.value));
					return;
				}

				messageForNextStep = (<DomainEvent<unknown>>stepResult.value).getContent();
				this.currentSagaStepIndex++;
			}

			this.currentSagaStepIndex = 0;
		}

		private hasStepLeft(): boolean {
			return this.currentSagaStepIndex <= this.saga.length - 1;
		}

		private async compensate(stepIndex: number, input: CompensationMessage<unknown>): Promise<void> {
			this.currentSagaStepIndex = stepIndex;
			if (this.currentSagaStepIndex < 0) {
				this.currentSagaStepIndex = 0;
				return;
			}
			const compensationMessage = await this.saga[this.currentSagaStepIndex].compensate(input);
			await this.compensate(this.currentSagaStepIndex - 1, compensationMessage);
		}
	}
}
