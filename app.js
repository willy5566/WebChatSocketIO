const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let onlineCount = 0;

app.use(express.static('public'));

// 設置路由，處理根路徑的請求
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// WebSocket 連接事件
io.on('connection', (socket) => {
    console.log('A user connected');

    onlineCount++;

    io.emit('online', onlineCount);

    // 接收來自客戶端的消息
    socket.on('greet', () => {
        // 將消息廣播給所有客戶端
        io.emit('greet', onlineCount);
    });

    socket.on('send', (msg) => {
        if(Object.keys(msg).length < 2) return;

        io.emit('msg', msg);
    })

    // 用戶斷開連接事件
    socket.on('disconnect', ()=> {
        console.log('User disconnected');

        onlineCount = (onlineCount < 0) ? 0 : onlineCount-=1;
        io.emit('online', onlineCount);
    });
});

// 指定 IP 地址和端口
const ip = '10.10.60.148'; // 這裡使用本地回環地址
const port = 3000;

// 監聽指定 IP 和端口
server.listen(port, ip, () => {
  console.log(`Server is running at http://${ip}:${port}`);
});

