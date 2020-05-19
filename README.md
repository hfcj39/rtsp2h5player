# 功能
rtsp转FLV从而使前端可以使用h5播放器

# 用法
目前需要手动安装ffmpeg。  
如果前端使用flvjs，在播放器地址填写本服务端地址+rtsp地址即可，config中配置端口，e.g.  

### ffmpeg

```javascript
flvjs.createPlayer({
    type: 'flv',
    url: 'http://127.0.0.1:11451/api/ffmpeg/?url=rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov',
    isLive: true,
})
```

## 其他分支
dev分支是一个更为简单的demo，包含live555的转码方式。

# todo
当前实现方式仅供demo，后续有时间继续优化

http2支持
