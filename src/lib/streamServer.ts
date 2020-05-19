import {Transcoder} from './transcoder'
import {PassThrough} from "stream";

export class StreamServer {

    private static _server: StreamServer
    private _streams: Transcoder[] = []

    public static getInstance() {
        if (this._server) {
            return this._server
        }
        return this._server = new this()
    }

    constructor() {
    }

    public getStream(url): PassThrough {
        let stream: PassThrough = new PassThrough()
        let data_stream: Transcoder
        const dataStreamIndex: number = this._streams.findIndex((stream) => {
            return stream.url = url
        })
        if (dataStreamIndex < 0) {
            data_stream = this.createStream(url)
        } else {
            data_stream = this._streams[dataStreamIndex]
        }
        data_stream.connect++
        data_stream.pipe(stream)
        stream.on('close', () => {
            data_stream.unpipe(stream)
            data_stream.connect--
            if (data_stream.connect <= 0) {
                this.delStream(data_stream)
            }
        })
        return stream
    }

    private createStream(url): Transcoder {
        const data_stream: Transcoder = new Transcoder(url)
        this._streams.push(data_stream)
        return data_stream
    }

    delStream(transcoder: Transcoder): void {
        let index: number = this._streams.indexOf(transcoder);
        if (index > -1) {
            this._streams.splice(index, 1);
            transcoder.stopStreamWrap();
        }
    }
}
