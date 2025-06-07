import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"]
  }
});

const activeSessions = new Map<string, { folio: string, timeout: NodeJS.Timeout }>();

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  socket.on('reserveFolio', (folio: string) => {
    if ([...activeSessions.values()].some(session => session.folio === folio)) {
      socket.emit('folioExists', { folio });
      return;
    }

    const timeout = setTimeout(() => {
      activeSessions.delete(socket.id);
      socket.emit('folioExpired', { folio });
    }, 5 * 60 * 1000);

    activeSessions.set(socket.id, { folio, timeout });
    socket.emit('folioReserved', { folio });
  });

  socket.on('confirmPayment', (folio: string) => {
    const session = activeSessions.get(socket.id);
    if (session && session.folio === folio) {
      clearTimeout(session.timeout);

      // Aquí iría la lógica de pago como completado en la DBZ
      socket.emit('paymentConfirmed', { folio });
    }
  });

  socket.on('disconnect', () => {
    const session = activeSessions.get(socket.id);
    if (session) {
      clearTimeout(session.timeout);
      activeSessions.delete(socket.id);
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor WebSocket escuchando en puerto ${PORT}`);
});