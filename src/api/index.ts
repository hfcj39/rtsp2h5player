import * as Router from 'koa-router';
import ffmpegApi from './ffmpeg'

const router = new Router();

router.use('/ffmpeg', ffmpegApi.routes(), ffmpegApi.allowedMethods());

export default router
