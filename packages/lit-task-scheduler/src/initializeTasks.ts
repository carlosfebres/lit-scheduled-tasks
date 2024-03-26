import { Agenda } from '@hokify/agenda';
import { handleTask as handleAutoTopUp, taskName as autoTopUpName } from 'lit-task-auto-top-up';

const AUTO_TOP_UP_TASK_NAME = `daily ${autoTopUpName}`;
export default async function initializeTasks(taskClient: Agenda) {
  // Idempotent calls here only. Yay. :)
  await taskClient.every('1 day', AUTO_TOP_UP_TASK_NAME);
  taskClient.define(AUTO_TOP_UP_TASK_NAME, async (job) => {
    // The task will only fail if we are unable to fetch JSON from Github
    // Otherwise we log successes and failures internally for individual mints/transfer ops
    // and exit without an error code
    await handleAutoTopUp(job);
  });
}
