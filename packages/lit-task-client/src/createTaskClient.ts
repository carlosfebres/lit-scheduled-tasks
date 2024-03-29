import { Agenda } from '@hokify/agenda';

import { Config } from './types/types';

export function createTaskClient({ config }: { config: Config }) {
  const {
    envConfig: { MONGO_DB_NAME, MONGO_PASSWORD, MONGO_SERVER, MONGO_USER },
  } = config;

  return new Agenda({
    db: {
      address: `mongodb+srv://${`${MONGO_SERVER}`}/${MONGO_DB_NAME}`,
      collection: 'tasks',
      options: {
        auth: { password: MONGO_PASSWORD, username: MONGO_USER },
      },
    },
    ensureIndex: true,
    processEvery: 5000,
  });
}
