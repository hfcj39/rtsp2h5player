import {ChildProcess, spawn} from "child_process";
import {PassThrough} from "stream";

export class Transcoder extends PassThrough {
    public url: string
    private _ffmpeg: ChildProcess;
    public connect: number = 0;

    constructor(url: string) {
        super()
        if (!url) {
            throw new Error('no `url` parameter');
        }
        this.url = url
        this._ffmpeg = spawn('ffmpeg', ['-loglevel', 'quiet', '-i', this.url, '-an', '-c:v', 'copy', '-f', 'flv', 'pipe:1']);
        this._ffmpeg.stdio[1].pipe(this);
        this._ffmpeg.on('error', (err) => {
            console.log('ffmpeg error', err)
        })
    }

    public stopStreamWrap(): void {
        this._ffmpeg.removeAllListeners();
        this._ffmpeg.stdio[1].unpipe(this);
        this._ffmpeg.stdio[1].destroy();
        this._ffmpeg.kill();
        this._ffmpeg = null;
    }
}
