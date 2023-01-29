import Router from 'koa-router';

const router = new Router();

router.get('/', async (ctx, next) => {
  ctx.body = 'ok';
  await next();
});

router.get('/health', async (ctx, next) => {
  ctx.body = 'ok computer';
  await next();
});

export default router;
