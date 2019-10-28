import * as Koa from 'koa'
import * as Router from 'koa-router';
import config from './config'
import api from './api'

const app = new Koa();

const route = new Router();
route.use('/api', api.routes(), api.allowedMethods());

app.use(route.routes()).use(route.allowedMethods());

app.listen(config.port);

console.log(`Server running on port ${config.port}`);
