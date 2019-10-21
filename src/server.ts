import * as Koa from 'koa'
import * as Router from 'koa-router';
import {PassThrough} from 'stream'
import liveServer from './lib/index';
import config from './config'

const app = new Koa();
const router = new Router();

router.get('/*', async (ctx) => {
    const url = ctx.request.url.slice(1);
    if (url) {
        ctx.set({
            'Access-Control-Allow-Origin': '*',
            'Connection': 'Keep-Alive',
            'Content-Type': 'video/x-flv'
        });
        // ctx.status = 200;
        let stream = new liveServer(url);
        const _stream = new PassThrough();
        stream.on('start', () => {
            console.log(url + ' started');
        });
        stream.on('stop', () => {
            console.log(url + ' stopped');
        });
        stream.on('data', (data) => {
            let _success: boolean = _stream.write(data);
        });
        _stream.on('close', () => {
            console.log('passThrough-close');
            _stream.end();
            stream.stop();
            ctx.res.end()
        });
        // .on('finish', () => {
        //     console.log('passThrough-finish');
        //     _stream.end();
        //     stream.stop();
        //     ctx.res.end()
        // });

        ctx.body = _stream
    } else {
        ctx.status = 204;
        ctx.body = null;
    }
});

app.use(router.routes());

app.listen(config.port);

console.log(`Server running on port ${config.port}`);
