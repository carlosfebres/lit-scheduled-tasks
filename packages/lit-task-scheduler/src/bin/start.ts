import consola from 'consola';

import { getConfigFromEnv } from '../config';
import createTaskClient from '../createTaskClient';
import initializeTasks from '../initializeTasks';

const dbConfig = getConfigFromEnv(process.env);
const agenda = createTaskClient({ dbConfig });

agenda.start().then(async () => {
  consola.log('Agenda is running.');

  await initializeTasks(agenda);
});
