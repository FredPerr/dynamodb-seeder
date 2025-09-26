import { DynamoRepository } from "./DynamoRepository.js";
import type { Environment } from "./Environment.js";
import { DynamoSeedConfig, type ISeedConfig } from "./SeedConfig.js";

type DynamoSeedParams = {
	config: ISeedConfig;
	environmentName: string | string[] | true;
};

async function seedEnvironment(env: Environment, repository: DynamoRepository) {
	console.info(`Seeding environment: ${env.name}`);

	let failedBatches = 0;
	for (const table of env.tables) {
		const batches = table.getSeedItemBatches();

		await Promise.all(
			batches.map((batch) => repository.createBatch(table.tableName, batch)),
		).catch((err) => {
			console.error(
				`Error seeding batch in table "${table.tableName}": ${err.message}`,
			);
			failedBatches += 1;
		});
	}

	if (failedBatches > 0) {
		console.warn(
			`Seeding completed for environment: ${env.name} with ${failedBatches} failed batches.`,
		);
	} else {
		console.info(`Seeding completed successfully for environment: ${env.name}`);
	}
}

export async function seedDynamoDB(params: DynamoSeedParams) {
	const repository = new DynamoRepository(params.config.region);
	const config = new DynamoSeedConfig({
		...params.config,
	});

	console.info(
		"Available environments:",
		config.getEnvironmentNames().join(", "),
	);
	console.info("===============================");

	if (typeof params.environmentName === "boolean" && params.environmentName) {
		for (const envName of config.getEnvironmentNames()) {
			const env = config.getEnvironmentByName(envName);
			await seedEnvironment(env, repository);
		}
	} else if (Array.isArray(params.environmentName)) {
		for (const envName of params.environmentName) {
			const env = config.getEnvironmentByName(envName);
			await seedEnvironment(env, repository);
		}
	} else if (typeof params.environmentName === "string") {
		const env = config.getEnvironmentByName(params.environmentName);
		await seedEnvironment(env, repository);
	}
}
