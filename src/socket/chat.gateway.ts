/* eslint-disable prettier/prettier */
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  
  private users = new Map<string, string>();

  // Khi client kết nối
  handleConnection(socket: Socket) {
    console.log(`Client connected: ${socket.id}`);
  }

  // Khi client ngắt kết nối
  handleDisconnect(socket: Socket) {
    console.log(`Client disconnected: ${socket.id}`);
    
    // Tìm và xóa user dựa trên socket.id
    for (const [username, id] of this.users) {
      if (id === socket.id) {
        this.users.delete(username);
        console.log(`User ${username} has been removed`);
        break;
      }
    }
  }

  // Xử lý đăng ký user
  @SubscribeMessage('register')
  handleRegister(
    @MessageBody() username: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('register event received:', username);
    this.users.set(username, client.id);
    console.log(`User ${username} registered with socket ${client.id}`);
    
    // Có thể emit response về client để confirm
    client.emit('registerSuccess', { username, socketId: client.id });
  }

  @SubscribeMessage('privateMessage')
  handlePrivateMessage(
    @MessageBody() data: { sender: string; receiver: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { sender, receiver, message } = data;
    const targetSocketId = this.users.get(receiver);
    
    console.log('Private message from:', sender, 'to:', receiver);
    console.log('Target socket ID:', targetSocketId);
    
    if (targetSocketId) {
      // Gửi tin nhắn đến người nhận
      this.server.to(targetSocketId).emit('privateMessage', {
        sender,
        message,
        timestamp: new Date().toISOString(),
      });
      
      // Có thể gửi confirmation về người gửi
      client.emit('messageSent', {
        receiver,
        message,
        timestamp: new Date().toISOString(),
      });
    } else {
      // Thông báo nếu không tìm thấy người nhận
      client.emit('messageError', {
        error: 'User not found or offline',
        receiver,
      });
    }
  }

  // Thêm method để lấy danh sách users online (optional)
  @SubscribeMessage('getOnlineUsers')
  handleGetOnlineUsers(@ConnectedSocket() client: Socket) {
    const onlineUsers = Array.from(this.users.keys());
    client.emit('onlineUsers', onlineUsers);
  }
}