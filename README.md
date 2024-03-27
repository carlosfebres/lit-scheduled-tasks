# 🔥 LIT Scheduled Tasks 🔧

This repo provides scaffolding for running internal scheduled tasks on a CRON-like schedule.

## ❌ Installation

Packages in this repository are currently not published to NPM; it is expected to be deployed as a worker to Heroku.

## 🎮 Usage

#### To prepare for either production usage or local development, you must install dependencies and build the packages.

```zsh
pnpm install && pnpm build
```

#### For local development:

Note that local development uses `dotenvx` to load necessary environment vars from a `.env` file which must be located in the [lit-task-scheduler](packages/lit-task-scheduler) directory. See [example .env file](packages/lit-task-scheduler/.env.example)

```zsh
pnpm dev
```

#### For production:

Note that all environment variables for [lit-task-scheduler](packages/lit-task-scheduler/README.md) must be defined in the host environment.

```zsh
pnpm start
```

## 📦 Packages

| Package              | Purpose                                                               |
| -------------------- | --------------------------------------------------------------------- |
| lit-task-scheduler   | Initializes job schedules and executes tasks at scheduled intervals   |
| lit-task-auto-top-up | Mints capacity credit NFTs for a provided list of recipient addresses |

## 💻 Development

The repository is a mono-repo leverage `pnpm` as the package manager, using `pnpm workspaces`. It requires Node v18+, we recommend you use `nvm` to select the correct node version via the included `.nvmrc` file.

- Clone the repository
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
- Install dependencies by executing `pnpm install` in the root of the repo
- Build all packages by executing `pnpm build` in the root of the repo
- Currently, you must manually rebuild packages that are referenced locally using `workspace:*` references after making changes, until `unbuild stub` issues with Typescript have been resolved. Reference issue: https://github.com/unjs/unbuild/issues/370
