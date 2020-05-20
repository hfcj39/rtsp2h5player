import Validator from '../../utils/param-validator'
import {StreamServer} from "../../lib/streamServer";
import {PassThrough, Readable} from "stream";

const urlValidator = new Validator({
    url: {ctx: 'query', type: 'url', required: true},
});

export const ffmpeg2flv = async (ctx) => {
    const {url} = urlValidator.validate(ctx);
    ctx.set({
        'Access-Control-Allow-Origin': '*',
        // 'Connection': 'Keep-Alive',
        'Content-Type': 'video/x-flv'
    });
    const streamServer = StreamServer.getInstance();
    ctx.body = streamServer.getStream(url)
};
