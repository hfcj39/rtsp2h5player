import {Transcoder} from "../../lib";
import {PassThrough} from "stream";
import Validator from '../../utils/param-validator'

const urlValidator = new Validator({
    url: {ctx: 'query', type: 'url', required: true},
});

export const trans2flvByLive = async (ctx) => {
    const {url} = urlValidator.validate(ctx);
    if (url) {
        ctx.set({
            'Access-Control-Allow-Origin': '*',
            'Connection': 'Keep-Alive',
            'Content-Type': 'video/x-flv'
        });
        let stream = new Transcoder(url, 'live555');
        const _stream = new PassThrough();
        stream.on('start', () => {
            console.log(url + ' started');
        });
        stream.on('stop', () => {
            console.log(url + ' stopped');
            _stream.end();
        });
        stream.on('data', (data) => {
            let _success: boolean = _stream.write(data);
        });
        _stream.on('close', () => {
            console.log('passThrough-close');
            _stream.removeAllListeners('data');
            stream.stop();
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
