const str = (name: string, fallback: string): string => process.env[name] || fallback;

const int = (name: string, fallback: number): number => {
  const raw = process.env[name];
  if (raw === undefined || raw === '') return fallback;
  const n = Number(raw);
  if (!Number.isInteger(n)) throw new Error(`${name} must be an integer, got "${raw}"`);
  return n;
};

export const config = {
  api: {
    port: int('SERVICE_PORT', 3000),
  },
  nad: {
    name: str('NAD_NAME', 't778'),
    host: str('NAD_HOST', 'nad.local'),
    port: int('NAD_PORT', 8585),
  },
};
