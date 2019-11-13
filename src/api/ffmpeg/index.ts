import * as Router from 'koa-router';

const {ffmpeg2flv} = require('./ffmpeg.controller');
const router = new Router();

router.get('/', ffmpeg2flv);

export default router