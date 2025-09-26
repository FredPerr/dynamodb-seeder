# DynamoDB Seeder

Run structured DynamoDB seed scripts (written directly in TypeScript) with a simple CLI.

---

## Installation

Install as a dev dependency (recommended):

```bash
npm install --save-dev dynamodb-seeder
```

Or install globally if you want the `dyno` command everywhere:

```bash
npm install -g dynamodb-seeder
```

If you are developing this repo locally and want to test the CLI before publishing:

```bash
npm link  # from the project root after building (if build step exists)
```

---

## CLI Usage

Basic form:

```bash
dyno seed <path-to-seed-file.ts> --env <env...>
```

Examples:

```bash
# Single environment (required at least one)
dyno seed ./seeds/demo-seed.ts --env dev

# Multiple environments (space separated)
dyno seed ./seeds/demo-seed.ts --env dev staging qa
```

### Environments (Required)

You must supply at least one environment using `--env` / `-e`. The first provided value becomes the primary environment.

Inside the seed file you receive the array plus convenience environment variables:

| What | Description |
|------|-------------|
| `env` (function param) | `string[]` value passed to the default export |
| `process.env.DYNO_ENVS` | JSON string array of all environments (e.g. `["dev","staging"]`) |
| `process.env.DYNO_ENV`  | First environment (primary) |

### Show Help

```bash
dyno --help
dyno seed --help
```

This prints usage, options, and any examples defined in the CLI.

---

## Seed File Structure

Each seed file must default-export an `async` function. It will be invoked with an object whose shape is:

```ts
export default async function ({ env }: { env: string[] }) {
  // Your seeding logic
}
```

### Example Seed File

```ts
// ./seeds/demo-seed.ts
import { seedDynamoDB } from "dynamodb-seeder"; // adjust path if using sources locally
import { ConflictStrategy } from "dynamodb-seeder";

export default async function ({ env }: { env: string[] }) {
  await seedDynamoDB({
    environmentName: env, // always a string[] now
    config: {
      region: "ca-central-1",
      environments: [
        {
          name: "demo-env",
          tables: [
            {
              tableName: "dynamodb-seeder-demo",
              items: [
                {
                  data: { id: "1", name: "Item 1" },
                  conflictStrategy: ConflictStrategy.Overwrite,
                  type: "DemoEntity",
                },
                {
                  data: { id: "2", name: "Item 2" },
                  conflictStrategy: ConflictStrategy.Overwrite,
                  type: "DemoEntity",
                },
              ],
              mappers: {
                // Should be the mapper of the domain model to the entity data (including indexes)
                DemoEntity: (item) => ({
                  PK: `DEMO#${item.id}`,
                  SK: `DEMO#${item.id}`,
                  name: item.name,
                  _et: "DemoEntity",
                }),
              },
            },
          ],
        },
      ],
    },
  });
}
```

Run it:

```bash
dyno seed ./seeds/demo-seed.ts --env dev
```

---

## Behavior Notes

- Seed files are executed directly via `ts-node` (no manual build step required for them).
- If the default export is not a function, the CLI will warn and continue.
- Multiple environments: the first one becomes the primary (`process.env.DYNO_ENV`).
- No validation is currently performed on environment names—pass whatever labels are meaningful to you.

---

## Troubleshooting

| Issue                                  | Fix                                                                                      |
| -------------------------------------- | ---------------------------------------------------------------------------------------- |
| `command not found: dyno`              | Ensure package installed globally, or run via `npx`, or add a local script.              |
| Permission error running file directly | Add execute bit: `chmod +x src/cli.ts` (only if running the TypeScript source directly). |
| No output / not running seed           | Confirm the file path is correct and the file has a default exported async function.     |

---

## Improvement Ideas

---
