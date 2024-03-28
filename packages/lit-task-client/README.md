# 🔥 Task Client 🔧

Schedule tasks to run at cron or human-readable intervals.

### Usage

- Use `getConfig()` to parse configuration from process.env in a type-safe way
- See [.env.example](.env.example) file for required ENV vars for the task client.
- Use `createTaskClient()` to create an instance of the task client - an [Agenda](https://www.npmjs.com/package/@hokify/agenda) instance.
- Collection will always be `tasks`. Database name provided by env var.

### Exports

| Name                 | Purpose                                                                                          |
| -------------------- | ------------------------------------------------------------------------------------------------ |
| **createTaskClient** | Returns an Agenda instance configured with the provided Config (from `getConfig())               |
| **getConfig**        | Method that loads required configuration for the task client in a type-safe way from process.env |

### Development

See [root README](../../README.md) for development details
