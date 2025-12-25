import { Gauge, Registry } from 'prom-client';
import { prometheus } from '@hono/prometheus';

const registry = new Registry();

export const { printMetrics, registerMetrics } = prometheus({
  registry,
});

export const audioAmplifierTemperature = new Gauge({
  name: 'audio_amplifier_temperature',
  help: 'Audio amplifier temperature',
  labelNames: ['name', 'location'],
  registers: [registry],
});

export const audioAmplifierFan = new Gauge({
  name: 'audio_amplifier_fan',
  help: 'Audio amplifier temperature',
  labelNames: ['name', 'type'],
  registers: [registry],
});
