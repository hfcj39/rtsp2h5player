import {EventEmitter} from 'events'
import {ChildProcess, spawn} from "child_process"
import {join} from 'path'
import * as os from 'os'

class Transcoder extends EventEmitter {
    private readonly url: string;
    private readonly mode: string;
    private count: number = 0;
    private child: ChildProcess;

    constructor(url, mode) {
        super();
        if (url && mode) {
            this.url = url;
            this.mode = mode;
            this.on('newListener', (event) => {
                if (event === 'data' && this.listeners(event).length === 0) {
                    this.start();
                }
            });
            this.on('removeListener', (event) => {
                if (event === 'data' && this.listeners(event).length === 0) {
                    this.stop();
                }
            });
        } else {
            throw new Error('no `url` parameter');
        }
    }

    start() {
        if (this.mode === 'ffmpeg') {
            let args = [
                "-loglevel", "error",
                // "-loglevel", "fatal",
                "-i", this.url,
                // "-i", '/Users/bingpo/Downloads/cars.mp4',
                // "-profile:v","main",
                // "-preset:v","fast",
                // "-rtbufsize", "100M",
                "-acodec", "copy",
                "-vcodec", "copy",
                "-f", "flv", "-",
            ];
            this.child = spawn('ffmpeg', args);
        } else if (this.mode === 'live555') {
            this.child = spawn(Transcoder.getCmd(), [this.url]);
        } else {
            console.log('mode', this.mode);
            throw new Error('unsupported mode')
        }
        this.child.stdout.on('data', this.emit.bind(this, 'data'));
        this.child.stderr.on('data', function (data) {
            console.log('stderr', data.toString())
            // throw new Error(data);
        });
        this.child.on('error', (err) => {
            console.log('Error', err);
            this.stop.call(this);
        });
        this.child.on('close', (code, sig) => {
            console.log('child closed, code:', code, sig);
            if (code === 0) {
                this.restart.call(this)
            } else {
                this.stop.call(this);
            }
        });
        this.emit('start');
    }

    stop() {
        if (this.child) {
            // this.child.disconnect();
            this.child.kill('SIGKILL');
            this.child = null;
            this.emit('stop');
        }
    }

    restart() {
        if (this.child && this.count < 3) {
            console.log('restarting...');
            this.child.kill();
            delete this.child;
            this.start();
            this.count++
        }
    }

    private static getCmd() {
        const clientname = 'live555client';
        const rootPath = join(__dirname, '../../');
        const platformarch = os.arch();
        const platform = os.platform();
        return join(rootPath, 'src/lib/extend', platform, platformarch, clientname);
    }
}

export default Transcoder
