module.exports = {
    apps: [{
        name: 'RTSP',
        script: 'dist/server.js',

        // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
        instances: "max",
        exec_mode: "cluster",
        max_restarts: 3,
        autorestart: true,
        watch: true,
        max_memory_restart: '1G',
        env: {
            NODE_ENV: 'production'
        },
    }],
};
