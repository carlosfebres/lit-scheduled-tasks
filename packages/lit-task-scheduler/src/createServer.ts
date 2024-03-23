import { Agenda } from '@hokify/agenda';

export default async function createServer() {
  const server = new Agenda();
  // TODO: Load address and user credentials from environment
  return server.database('localhost:27017/lit-jobs', 'jobs');
}
