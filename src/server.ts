import * as Koa from 'koa'
import * as Router from 'koa-router';
import config from './config'
import api from './api'

const app = new Koa();
const router = new Router();

const route = new Router();
route.use('/api', api.routes(), api.allowedMethods());

app.use(router.routes());

app.listen(config.port);

console.log(`Server running on port ${config.port}`);
