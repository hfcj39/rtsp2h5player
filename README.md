# 功能
rtsp转FLV从而使前端可以使用h5播放器

# 用法
目前需要手动安装ffmpeg。
如果使用flvjs，在播放器地址填写本服务端地址+rtsp地址即可，config中配置端口，e.g.  

### ffmpeg

```javascript
flvjs.createPlayer({
    type: 'flv',
    url: 'http://127.0.0.1:11451/api/ffmpeg/?url=rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov',
    isLive: true,
})
```

### live555

*对于高分辨率码流暂时可能出现花屏，会在后续版本中修复*

```javascript
flvjs.createPlayer({
    type: 'flv',
    url: 'http://127.0.0.1:11451/api/live555/?url=rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov',
    isLive: true,
})
```

# todo
当前实现方式仅供demo，后续有时间继续优化

http2支持
