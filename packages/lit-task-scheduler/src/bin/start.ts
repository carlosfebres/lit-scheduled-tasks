import getConfig from '../actions/getConfig';
import createTaskClient from '../createTaskClient';
import initializeTasks from '../initializeTasks';

const config = getConfig();
const agenda = createTaskClient({ config });

agenda.start().then(async () => {
  const { logger } = config;
  logger.log('Agenda is running.');

  await initializeTasks(agenda);
});
