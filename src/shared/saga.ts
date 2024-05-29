import { Result } from "@sefr/result";
import { Command } from "@shared/command";
import { CommandConstructor } from "@shared/constructor";
import { DomainEvent } from "@shared/domain-event";

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
		private readonly steps: Array<Saga.Step<Command<unknown>, DomainEvent<unknown> | CompensationMessage<unknown>>>;
		private currentStep: number;

		public constructor() {
			this.steps = [];
			this.currentStep = 0;
		}

		public addStep(step: Saga.Step<Command<unknown>, DomainEvent<unknown> | CompensationMessage<unknown>>): void {
			this.steps.push(step);
		}

		public async execute(initialMessage: unknown): Promise<void> {
			let commandCreatedFromMessage: Command<unknown>;
			let messageForNextStep = initialMessage;

			while (this.currentStep <= this.steps.length - 1) {
				commandCreatedFromMessage = new this.steps[this.currentStep].Command(messageForNextStep);
				const result = await this.steps[this.currentStep].execute(commandCreatedFromMessage);

				if (result.isFailure) {
					const previousStep = this.currentStep - 1;
					await this.compensate(previousStep, new CompensationMessage(result.value));
					return;
				}

				messageForNextStep = (<DomainEvent<unknown>>result.value).getContent();
				this.currentStep++;
			}

			this.currentStep = 0;
		}

		private async compensate(stepIndex: number, input: CompensationMessage<unknown>): Promise<void> {
			this.currentStep = stepIndex;
			if (this.currentStep < 0) {
				this.currentStep = 0;
				return;
			}
			const result = await this.steps[this.currentStep].compensate(input);
			await this.compensate(this.currentStep - 1, result);
		}
	}
}
