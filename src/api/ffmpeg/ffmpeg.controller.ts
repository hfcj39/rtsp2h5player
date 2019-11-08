import {PassThrough} from "stream";
import {spawn} from "child_process"
import {Validator} from '../../utils/param-validator'
import {liveServer} from "../../lib";

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
        let args = [
            "-i", url,
            "-acodec", "copy", "-vcodec", "copy",
            "-f", "flv", "-",
        ];
        let ffmpeg = spawn("ffmpeg", args);
        ffmpeg.stdout.on("data", (chunk) => {
            let _success: boolean = _stream.write(chunk);
        });
        _stream.on('close', () => {
            console.log('passThrough-close');
            _stream.end();
            //还要kill子线程
            ctx.res.end()
        });
        ctx.body = _stream
    }
};