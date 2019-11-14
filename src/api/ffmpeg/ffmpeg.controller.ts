import {PassThrough} from "stream";
import {spawn} from "child_process"
import Validator from '../../utils/param-validator'
import {Transcoder} from "../../lib";

const urlValidator = new Validator({
    url: {ctx: 'query', type: 'url', required: true},
});
export const ffmpeg2flv = async (ctx) => {
    const {url} = urlValidator.validate(ctx);
    if (url) {
        ctx.set({
            'Access-Control-Allow-Origin': '*',
            'Connection': 'Keep-Alive',
            'Content-Type': 'video/x-flv'
        });
        const _stream = new PassThrough();

        let stream = new Transcoder(url, 'ffmpeg');
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
        ctx.body = _stream
    } else {
        ctx.status = 204;
        ctx.body = null;
    }
};

export const testFFmpeg2flv = async (ctx) => {
    const {url} = urlValidator.validate(ctx);
    if (url) {
        ctx.set({
            'Access-Control-Allow-Origin': '*',
            'Connection': 'Keep-Alive',
            'Content-Type': 'video/x-flv'
        });
        const _stream = new PassThrough();
        let args = [
            "-i", url,
            "-an",
            "-vcodec", "copy",
            "-f", "flv", "-",
        ];
        let ffmpeg = spawn("ffmpeg", args);
        ffmpeg.stdout.on("data", (chunk) => {
            let _success: boolean = _stream.write(chunk);
        });
        ffmpeg.stderr.on('data', (data) => {
            console.log(data.toString());
            // throw new Error(data)
        });
        _stream.on('close', (code) => {
            console.log('passThrough-close', code);
            _stream.end();
            //还要kill子线程
            ffmpeg.kill();
            ctx.res.end()
        });
        ctx.body = _stream
    }
};
