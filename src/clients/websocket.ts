import WebSocket from 'ws';
import { config } from '../config.js';

// class NADOSDWebSocket {
//
//   private readonly url: string;
//   private socket?: WebSocket;
//
//   constructor(url: string) {
//     this.url = url;
//   }
//
//   connect() {
//     this.socket = new WebSocket(this.url);
//     this.socket.on('open', () => {
//       //this.socket.send('Main?');
//     });
//   }
//
// }

export const connect = () => {
  const ws = new WebSocket(`ws://${config.nad.host}:${config.nad.port}/`)

  ws.on('error', console.error);

  ws.on('open', function open() {
    console.log('open ws');
    ws.send('Main.Model?');
    // gets complete state
    ws.send('Main?');
  });

  ws.on('error', console.error);

  ws.on('message', function message(data) {
    console.log('ws received: %s', data);
  });
};
