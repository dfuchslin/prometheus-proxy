import dotenv from 'dotenv';
import env from 'env-var';

dotenv.config();

export const config = {
  api: {
    port: env.get('API_PORT').default('3000').asInt(),
  },
  prometheus: {
    address: env.get('PROMETHEUS_ADDRESS').default('prometheus.local:80').asString(),
  },
  nad: {
    host: env.get('NAD_HOST').default('nad.local').asString(),
    port: env.get('NAD_PORT').default('8585').asInt(),
  }
};
