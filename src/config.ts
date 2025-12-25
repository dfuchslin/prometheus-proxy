import dotenv from 'dotenv';
import env from 'env-var';

dotenv.config({ quiet: true });

export const config = {
  api: {
    port: env.get('API_PORT').default('3000').asInt(),
  },
  nad: {
    host: env.get('NAD_HOST').default('nad.local').asString(),
    port: env.get('NAD_PORT').default('8585').asInt(),
  }
};
