import { Agenda } from '@hokify/agenda';

import { EnvConfig } from './config';

interface CreateTaskClientConfig {
  dbConfig: EnvConfig;
}

export default function createTaskClient({ dbConfig }: CreateTaskClientConfig) {
  const { MONGO_DB_NAME, MONGO_PASSWORD, MONGO_SERVER, MONGO_USER } = dbConfig;

  return new Agenda({
    db: {
      address: `mongodb+srv://${`${MONGO_SERVER}`}/${MONGO_DB_NAME}`,
      collection: 'tasks',
      options: {
        auth: { password: MONGO_PASSWORD, username: MONGO_USER },
      },
    },
    ensureIndex: true,
    processEvery: 60000,
  });
}
