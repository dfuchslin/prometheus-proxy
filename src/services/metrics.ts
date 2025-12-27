import { Gauge, Registry } from 'prom-client';
import { prometheus } from '@hono/prometheus';

const registry = new Registry();

export const { printMetrics, registerMetrics } = prometheus({
  registry,
});

export const audioAmplifierTemperature = new Gauge({
  name: 'audio_amplifier_temperature',
  help: 'Audio amplifier temperature',
  labelNames: ['id', 'location'],
  registers: [registry],
});

export const audioAmplifierFan = new Gauge({
  name: 'audio_amplifier_fan',
  help: 'Audio amplifier temperature',
  labelNames: ['id', 'type'],
  registers: [registry],
});

export const audioAmplifierPower = new Gauge({
  name: 'audio_amplifier_power',
  help: 'Audio amplifier power',
  labelNames: ['id'],
  registers: [registry],
});

export const audioAmplifierVolume = new Gauge({
  name: 'audio_amplifier_volume',
  help: 'Audio amplifier volume',
  labelNames: ['id'],
  registers: [registry],
});
