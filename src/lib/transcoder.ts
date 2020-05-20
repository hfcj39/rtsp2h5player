import {ChildProcess, spawn} from "child_process";
import {PassThrough, Readable} from "stream";

export class Transcoder {
    public url: string
    private _ffmpeg: ChildProcess;
    private _flv: Readable[] = [];
    public connect: number = 0;

    constructor(url: string) {
        if (!url) {
            throw new Error('no `url` parameter');
        }
        this.url = url
        this._ffmpeg = spawn('ffmpeg', ['-loglevel', 'quiet', '-i', this.url, '-an', '-c:v', 'copy', '-f', 'flv', 'pipe:1']);
        // this._ffmpeg.stdio[1].pipe(this);
        this._ffmpeg.on('error', (err) => {
            console.log('ffmpeg error', err)
        })
        this._ffmpeg.stdout.on('data', (chunk) => {
            // console.log('收到数据,flv数', this._flv.length)
            for (let elem of this._flv) {
                // console.log(elem)
                elem.push(chunk)
            }
        })
        this._ffmpeg.stdout.on('end', () => {
            console.log('ffmpeg 结束')
            for (let elem of this._flv) {
                elem.push(null)
            }
        });
        this._ffmpeg.stderr.on('data', (err) => {
            console.log(err.toString())
        })
    }

    //触发close时间的时候，在数组中删除close的流
    public closeFLVStream(index) {
        this._flv.splice(index, 1)
    }

    public getFLVStream() {
        const readable = new Readable()
        readable._read = function () {
        }
        const index = this._flv.push(readable) - 1

        return {readable, index}
    }

    public stopStreamWrap(): void {
        console.log('delete ')
        this._ffmpeg.removeAllListeners();
        // this._ffmpeg.stdio[1].unpipe(this);
        this._ffmpeg.stdio[1].destroy();
        this._ffmpeg.kill();
        this._ffmpeg = null;
    }
}
