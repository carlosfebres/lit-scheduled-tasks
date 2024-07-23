# 🔥 LIT Scheduled Tasks 🔧

This repo provides scaffolding for running internal scheduled tasks on a CRON-like schedule.

### If you need to add an account to receive auto-top-up rate limit NFTs, see the [worker readme](./worker/README.md)

## ❌ Installation

Packages in this repository are currently not published to NPM; it is expected to be deployed as a worker to Heroku.

## 🎮 Usage

#### To prepare for either production usage or local development, you must install dependencies and build the packages.

```zsh
pnpm install && pnpm build
```

#### For local development:

Note that local development uses `dotenvx` to load necessary environment vars from a `.env` file which must be located in the root directory of the repository to be loaded.

```zsh
pnpm dev
```

#### For production:

Note that [all environment variables](.env.example) for the worker process must be defined in the host environment. Production does not use `dotenvx`.

```zsh
pnpm start
```

## 📦 Packages

| Package                                                         | Purpose                                                                                                    |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| [lit-task-client](packages/lit-task-client/README.md)           | Load and validate mongo credentials from env in a type-safe way, and produce a task client Agenda instance |
| [lit-task-auto-top-up](packages/lit-task-auto-top-up/README.md) | Task to mint capacity credit NFTs for a list of recipient addresses defined in JSON at a configured URL    |

## 💻 Development

The repository is a mono-repo leveraging `pnpm` as the package manager, using `pnpm workspaces`. It requires Node v18+, it is recommended that you use `nvm` to select the correct node version via the included `.nvmrc` file.

- Clone the repository
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
- Install dependencies by executing `pnpm install` in the root of the repo
- Build all packages by executing `pnpm build` in the root of the repo
- Currently, you must manually rebuild packages that are referenced locally using `workspace:*` references after making changes, until `unbuild stub` issues with Typescript have been resolved. Reference issue: https://github.com/unjs/unbuild/issues/370
