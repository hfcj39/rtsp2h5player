import * as Router from 'koa-router';
const {trans2flvByLive} = require('./live555.controller');
const router = new Router();

router.post('/*', trans2flvByLive);

export default router