import env from 'env-var';

export const config = {
  api: {
    port: env.get('API_PORT').default('3000').asInt(),
  },
  prometheus: {
    address: env.get('PROMETHEUS_ADDRESS').default('prometheus.local:80').asString(),
  },
};
