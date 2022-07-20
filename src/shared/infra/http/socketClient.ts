import { SocketProvider } from '@shared/container/providers/SocketProvider/implementations/SocketProvider';
import { FetchSubscribedTickers } from '@utils/optionsHandler';
import { sliceIntoChunks } from '@utils/stringsHandler';
import net from 'net';
import { container } from "tsyringe";

// TCP server info
// const port = 1339;
// const host = '127.0.0.1';

let isAuthenticated = false;

function setupWebsocket(client: net.Socket, globalIO) {
    console.log('Hi.');

    globalIO.on("connection", (socket) => {
        console.log('Hello SQT.');
    });

    return globalIO;
}

function createSocketClient(globalIO) {
    const client = new net.Socket();

    client.connect({ port: port, host: host }, function () {
        // If there is no error, the server has accepted the request and created a new
        // socket dedicated to us.
        console.log('TCP connection established with the server.');

        // setup websocket functions to integrate both channels
        setupWebsocket(client, globalIO);

        // subscribe to tickers on our database
        subscribeStarter(client);
    });

    // The client can also receive data from the server by reading from its socket.
    client.on('data', function (chunk) {
        const message = chunk.toString();

        console.log(`SERVER: ${message}`);
    });

    client.on('end', function () {
        console.log('An end to the TCP connection was requested');
        isAuthenticated = false;
    });

    client.on('error', function (ex) {
        console.log("handled error");
        isAuthenticated = false;
        console.log(ex);
    });

    client.setTimeout(300 * 1000); // 300 seconds

    client.on("timeout", function () {
        console.log("Timeout!");
        isAuthenticated = false;
        client.end();
    });

    return client;
}

async function subscribeStarter(client: net.Socket) {
    const socketProvider = container.resolve(SocketProvider);

    const subscribed = await socketProvider.execute();

    subscribed.forEach((ticker) => {
        console.log(ticker);
    });
}

export { createSocketClient, isAuthenticated };
