import { createHttpServer, createSocketServer, runSocketCommands } from "../../../../socket_server/server";
import { app } from "./app";
import { createSocketClient } from "./socketClient";

const server = createHttpServer(app);
const io = createSocketServer(server);
runSocketCommands(io);

server.listen(process.env.APP_PORT, () => console.log("Server is running!"));

// connect to Cedro socket
let client = createSocketClient(io);
