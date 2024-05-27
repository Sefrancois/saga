import { Result } from "@sefr/result";

export namespace Saga {
	export interface Step {
		execute(...args: unknown[]): Promise<Result<unknown>>;
		compensate(...args: unknown[]): Promise<void>;
	}

	export class Runner {
		private readonly steps: Array<Saga.Step>;
		private currentStep: number;

		public constructor() {
			this.steps = [];
			this.currentStep = 0;
		}

		public addStep(step: Saga.Step): void {
			this.steps.push(step);
		}

		public async execute(): Promise<void> {
		}

		private async compensate(step: number): Promise<void> {
		}
	}
}
