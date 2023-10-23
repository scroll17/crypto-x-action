import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

const PORT = Number.parseInt(process.env.APP_GETAWAY_PORT, 10);

@WebSocketGateway(PORT, {
  transports: ['websocket'],
  allowEIO3: true,
})
export class AppGetaway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(this.constructor.name);

  public async handleConnection(client: Socket) {
    this.logger.verbose('CONNECTION to  Getaway', {
      client: client.id,
      data: client.data,
    });

    client.disconnect();
  }

  public async handleDisconnect(client: Socket) {
    this.logger.verbose('DISCONNECTION', {
      client: client.id,
      data: client.data,
    });
  }
}
