import * as Router from 'koa-router';
import live555 from './live555'

const router = new Router();

router.use('/live555', live555.routes(), live555.allowedMethods());

export default router
