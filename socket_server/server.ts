import { Express } from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

interface CustomSocket extends Socket {
    nickname: string;
}

function createHttpServer(app: Express) {
    const httpServer = createServer(app);

    return httpServer;
}

function createSocketServer(httpServer: any) {
    const io = new Server(httpServer, {
        cors: {
            origin: '*'
        },
        transports: ['websocket'],
    });

    return io;
}

function runSocketCommands(io) {
    // socket.emit allows you to emit custom events on the server and client
    // socket.send sends messages which are received with the 'message' event
    io.on("connection", (socket: CustomSocket) => {
        // send message to recently connected socket
        socket.emit("greetings", "Hello! You are connected to websocket.");

        console.log(`Client with ID of ${socket.id} connected!`);

        // set socket nickname
        socket.on('setNickname', function (name) {
            socket.nickname = name;
            socket.emit("NickReady");
            console.log(socket.nickname)
        });

        // handle the "message" event sent with socket.emit()
        socket.on("message", (data) => {
            console.log(data);
        });

        // handle the event sent with socket.emit()
        socket.on("salutations", (elem1, elem2, elem3) => {
            console.log(elem1, elem2, elem3);
        });

        socket.on('disconnect', () => {
            console.log(`Disconnected: ${socket.id}`);
        });
    });
}

function runWebSocket() {
    const httpServer = createServer();
    const io = createSocketServer(httpServer);
    runSocketCommands(io);
    httpServer.listen(3456, () => console.log("Socket is running!\n"));
}

runWebSocket();

export { createHttpServer, createSocketServer, runSocketCommands };
