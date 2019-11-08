import {EventEmitter} from "events";
import {ChildProcess, spawn} from "child_process";

class FFmpegConverter extends EventEmitter {
    private readonly url: string;
    private child: ChildProcess;

    constructor(url) {
        super();
        if (url) {
            this.url = url;
            // this.on('newListener', (event) => {
            //     if (event === 'data' && this.listeners(event).length === 0) {
            //         this.start();
            //     }
            // });
            // this.on('removeListener', (event) => {
            //     if (event === 'data' && this.listeners(event).length === 0) {
            //         this.stop();
            //     }
            // });
        } else {
            throw new Error('no `url` parameter');
        }
    }

    start() {
    }

    stop() {
    }

    restart() {
    }
}

export default FFmpegConverter