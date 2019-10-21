import {EventEmitter} from 'events'
import {ChildProcess, spawn} from "child_process"
import {join} from 'path'
import * as os from 'os'

class liveServer extends EventEmitter {
    private readonly url: string;
    private child: ChildProcess;

    constructor(url) {
        super();
        if (url) {
            this.url = url;
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
        this.child = spawn(liveServer.getCmd(), [this.url]);
        this.child.stdout.on('data', this.emit.bind(this, 'data')); //转发
        this.child.stderr.on('data', function (data) {
            throw new Error(data);
        });
        this.emit('start');

        this.child.on('error', (err) => {
            console.log('You may have not build Live555Client yet', err);
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
        const platformarch = os.arch();
        const platform = os.platform();
        return join(__dirname, 'extend', platform, platformarch, clientname);
    }
}

export default liveServer
