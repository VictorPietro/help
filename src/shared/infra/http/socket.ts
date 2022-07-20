import { createServer } from "http";
import { Server, Socket } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer);

io.on('connection', (socket: Socket) => {
    console.log('connected:', socket.client);
    // socket.on('serverEvent', function (data) {
    //     console.log('new message from client:', data);
    // });
    // setInterval(function () {
    //     socket.emit('clientEvent', Math.random());
    //     console.log('message sent to the clients');
    // }, 3000);
});
