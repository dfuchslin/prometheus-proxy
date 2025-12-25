import { Counter, Registry } from 'prom-client';

const registry = new Registry();
const customCounter = new Counter({
  name: 'custom_counter',
  help: 'A custom counter',
  registers: [registry],
});
