import {liveServer} from "../../lib";
import {PassThrough} from "stream";
import {Validator} from '../../utils/param-validator'

const urlValidator = new Validator({
    formClass: {ctx: 'fields', type: 'string', required: true},
    abc: {ctx: 'fields', type: 'string', required: true},
});

export const trans2flvByLive = async (ctx) => {
    const url = ctx.request.url.slice(1);
    if (url) {
        ctx.set({
            'Access-Control-Allow-Origin': '*',
            'Connection': 'Keep-Alive',
            'Content-Type': 'video/x-flv'
        });
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
}