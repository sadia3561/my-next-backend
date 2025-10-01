import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({ cors: true })
export class WsGateway {
  @WebSocketServer() server: Server;
  notifyQueueUpdate(payload: any) {
    this.server.emit("kyc:queue:update", payload);
  }
}
