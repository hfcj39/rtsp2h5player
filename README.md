# 功能
rtsp转FLV从而使前端可以使用h5播放器

# 用法
如果使用flvjs，在播放器地址填写本服务端地址+rtsp地址即可，config中配置端口，e.g.  
```javascript
flvjs.createPlayer({
    type: 'flv',
    url: 'http://127.0.0.1:3000/api/live555/rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov',
    isLive: true,
})
```

# todo
当前实现方式仅供demo，后续有时间继续优化

-[ ] 后续添加ffmpeg方式
-[ ] 添加原生手撸转码
-[ ] 并发能力
