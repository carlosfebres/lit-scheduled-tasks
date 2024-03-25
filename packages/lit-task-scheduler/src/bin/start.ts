import consola from 'consola';

import { getConfigFromEnv } from '../config';
import createTaskClient from '../createTaskClient';

const dbConfig = getConfigFromEnv(process.env);
const agenda = createTaskClient({ dbConfig });
agenda.start().then(() => {
  consola.log('Agenda is running.');
});
