import {Transcoder} from './transcoder'
import {PassThrough, Readable} from "stream";

export class StreamServer {

    private static _server: StreamServer
    private _streams: Transcoder[] = []

    public static getInstance(): StreamServer {
        if (this._server) {
            return this._server
        }
        return this._server = new this()
    }

    public getStream(url: string): Readable {
        const stream: PassThrough = new PassThrough()
        let data_stream: Transcoder
        const dataStreamIndex: number = this._streams.findIndex((stream) => {
            return stream.url === url
        })
        if (dataStreamIndex < 0) {
            data_stream = this.createStream(url)
            console.log('没有找到现有子进程，创建')
        } else {
            data_stream = this._streams[dataStreamIndex]
            console.log('找到子进程，复用')
        }
        data_stream.connect++
        const {readable, index} = data_stream.getFLVStream()
        // readable.pipe(stream)
        // stream.on('error', (err) => {
        //     console.log('err', err)
        // })
        // stream.on('finish', () => {
        //     console.log('finish')
        // })
        // stream.on('close', () => {
        //     console.log('连接关闭')
        //     data_stream.closeFLVStream(index)
        //     readable.unpipe(stream)
        //     data_stream.connect--
        //     if (data_stream.connect <= 0) {
        //         this.delStream(data_stream)
        //     }
        // })
        readable.on('close', () => {
            console.log('连接关闭')
            data_stream.closeFLVStream(index)
            // readable.unpipe(stream)
            data_stream.connect--
            if (data_stream.connect <= 0) {
                this.delStream(data_stream)
            }
        })
        return readable
    }

    private createStream(url: string): Transcoder {
        const data_stream: Transcoder = new Transcoder(url)
        this._streams.push(data_stream)
        return data_stream
    }

    delStream(transcoder: Transcoder): void {
        const index: number = this._streams.indexOf(transcoder);
        if (index > -1) {
            this._streams.splice(index, 1);
            transcoder.stopStreamWrap();
        }
    }
}
