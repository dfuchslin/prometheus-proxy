import { Hono } from 'hono';

const router = new Hono();

router.get('/', (c) => {
  return c.text('ok');
});

router.get('/health', (c) => {
  return c.text('ok computer');
});

export default router;
