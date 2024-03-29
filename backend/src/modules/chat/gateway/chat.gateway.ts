import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { ConnectedSocket } from "@nestjs/websockets/decorators";
import { OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets/interfaces";
import { ChatService } from "../service/chat.service";

@WebSocketGateway(8001, {cors: {
    origin: 'http://localhost:3000',
    credentials: true
}})
export class ChatGateway{
    constructor (
        private readonly chatService: ChatService
    ) {}

    @WebSocketServer()
    server;

    @SubscribeMessage('message')
    async handleMessage(@MessageBody() message, @ConnectedSocket() socket) {
        let check = true
        const ChatResponses = {
            REPORTED: 'REPORTED',
            EDITED: 'EDITED',
            DELETED: 'DELETED',
            READED: 'READED',
            CONFLICT: 'CONFLICT',
            NEED_MODERATION: 'NEED_MODERATION',
            CONNECT: 'CONNECT',
            DISCONNECT: 'DISCONNECT',
            TYPING: 'TYPING',
            ENDTYPING: 'ENDTYPING'
        }

        Object.keys(ChatResponses).map(item => {
            if(message?.message_content === ChatResponses[item]) check = false
        })
        if(message?.channel && check) {
            let createdMessage = await this.chatService.CreateMessage(message)
            if(!createdMessage) {
                this.server.emit(message.channel, {
                    message_content: ChatResponses.CONFLICT,
                    channel: message?.channel,
                    sender: message?.sender
                })
            } else {
                if(!message.channel.includes("group")){    
                    await this.chatService.CreateNotification({
                        user_id: message?.firstUserId === message?.senderId ?
                            message?.secondUserId : message?.firstUserId,
                        content: `${message?.username ?? message?.sender} sent a message`,
                        type: "message"
                    })
                }
                this.server.emit(message.channel, createdMessage);
            }
            // this.server.emit(message.channel, message);
        } else this.server.emit(message.channel, message);
    }
}