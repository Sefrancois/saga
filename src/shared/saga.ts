import { Result } from "@sefr/result";

export namespace Saga {
	export interface Step {
		execute(...args: unknown[]): Promise<Result<unknown>>;
		compensate(...args: unknown[]): Promise<void>;
	}

	export class Runner {
		private steps: Map<number, Saga.Step>;
		private currentStep: number;

		public constructor() {
			this.steps = new Map();
			this.currentStep = 0;
		}

		public addStep(step: Saga.Step): void {
			this.steps.set(this.steps.size, step);
		}

		public async execute(): Promise<void> {
			while (this.steps.has(this.currentStep)) {
				try {
					await this.steps.get(this.currentStep)!.execute();
					this.currentStep++;
				} catch(e) {
					await this.compensate(this.currentStep - 1);
				}
			}
		}

		private async compensate(step: number): Promise<void> {
			if (!this.steps.has(step)) {
				this.currentStep = 0;
				return Promise.resolve();
			}
			await this.steps.get(step)!.compensate();
			await this.compensate(step - 1);
		}
	}
}

