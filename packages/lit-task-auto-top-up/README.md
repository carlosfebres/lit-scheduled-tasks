# 🔥 Auto Top-up Task 🔧

Mint [Capacity Credit NFTs](https://developer.litprotocol.com/v3/sdk/capacity-credits) to a list of recipients on a schedule.

### Usage

- This module is designed to be used with `lit-task-client`
- Recipients are loaded from a URL by the task when it executes. See `recipientDetailSchema` exported `zod` schema for format of recipients.
- See [.env.example](.env.example) file for required ENV vars for this task.

### Exports

| Name                      | Purpose                                                                                       |
| ------------------------- | --------------------------------------------------------------------------------------------- |
| **taskName**              | Used to identify the name of the task for Agenda                                              |
| **getConfig**             | Method that loads required configuration for this task in a type-safe way from process.env    |
| **TaskHandler**           | Class that receives Config from `getConfig()` and exposes `handleTask(job: AgendaJob)` method |
| **recipientDetailSchema** | `zod` schema for validating JSON entries describing recipients of capacity NFTs               |

### Development

See [root README](../../README.md) for development details
