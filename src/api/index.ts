import * as Router from 'koa-router';
import live555 from './live555'
import ffmpegApi from './ffmpeg'

const router = new Router();

router.use('/live555', live555.routes(), live555.allowedMethods());
router.use('/ffmpeg', ffmpegApi.routes(), ffmpegApi.allowedMethods());

export default router
