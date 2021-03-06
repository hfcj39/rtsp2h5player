import * as Koa from 'koa'
import * as Router from 'koa-router';
import {createServer} from 'http2'
import config from './config'
import {errorHandler} from './utils/errorHandler'
import api from './api'

const app = new Koa();
app.use(errorHandler);

const route = new Router();
route.use('/api', api.routes(), api.allowedMethods());

app.use(route.routes()).use(route.allowedMethods());

const port = process.env.NODE_ENV === 'production' ? config.port.prd : config.port.dev;
app.listen(port);

// const server = createServer(app.callback);
// server.listen(config.port);

console.log(`Server running on port ${port}`, `env:${process.env.NODE_ENV}`);
