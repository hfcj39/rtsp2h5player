import {EventEmitter} from 'events'
import {ChildProcess, spawn} from "child_process"
import {join} from 'path'
import * as os from 'os'

class Transcoder extends EventEmitter {
    private readonly url: string;
    private readonly mode: string;
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
                "-i", this.url,
                "-acodec", "copy", "-vcodec", "copy",
                "-f", "flv", "-",
            ];
            this.child = spawn('ffmpeg', args);
        }else if(this.mode === 'live555'){
            this.child = spawn(Transcoder.getCmd(), [this.url]);
        }else {
            throw new Error('unsupported mode')
        }
        this.child.stdout.on('data', this.emit.bind(this, 'data'));
        this.child.stderr.on('data', function (data) {
            throw new Error(data);
        });
        this.emit('start');

        this.child.on('error', (err) => {
            console.log('Error', err);
            this.stop()
        });
        this.child.on('close', (code) => {
            console.log('child closed, code:', code);
            if (code === 0) {
                setTimeout(this.restart, 1000);
            }
        });
    }

    stop() {
        if (this.child) {
            this.emit('stop');
            this.child.kill();
            delete this.child;
        }
    }

    restart() {
        if (this.child) {
            this.stop();
            this.start();
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
