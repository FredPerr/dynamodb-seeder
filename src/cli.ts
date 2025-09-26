#!/usr/bin/env node

import { Command } from "commander";
import path from "node:path";
import { register } from "ts-node";

type RunnerOptions = {
	env: string[];
	filePath: string;
};

async function runSeedFile({ filePath, env }: RunnerOptions) {
	register({
		transpileOnly: true,
		compilerOptions: {
			module: "CommonJS",
			moduleResolution: "node",
			esModuleInterop: true,
		},
	});
	console.log(`🚀 Running seed file: ${filePath}`);
	const mod = await import(filePath);
	if (typeof mod.default === "function") {
		await mod.default({ env });
	} else {
		console.log(
			"❌ Seed file not executed (no default export function found).",
		);
	}
}

const program = new Command();

program.name("dyno").description("CLI for running seed files").version("0.0.1");

program
	.command("seed <file>")
	.description("Run a TypeScript seed file")
	.requiredOption(
		"-e, --env <env...>",
		"Environment name(s). Provide one or multiple separated by space: --env dev staging qa",
	)
	.action(async (file: string, options: { env: string[] }) => {
		const filePath = path.resolve(process.cwd(), file);
		const envs: string[] = Array.isArray(options.env)
			? options.env.filter(Boolean)
			: [options.env].filter(Boolean);

		if (!envs.length) {
			console.error(
				"❌ At least one environment must be provided using --env <name>.",
			);
			process.exit(1);
		}

		console.log(`🌱 Environments provided: ${envs.join(", ")}`);
		process.env.DYNO_ENVS = JSON.stringify(envs);
		process.env.DYNO_ENV = envs[0];

		try {
			await runSeedFile({ filePath, env: envs });
		} catch (err) {
			console.error("❌ Failed to run seed file:", err);
			process.exit(1);
		}
	});

program.parse(process.argv);
