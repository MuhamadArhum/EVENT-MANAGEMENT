let io;

function initSocket(server) {
  const socketIo = require('socket.io')(server, {
    cors: {
      origin: "*", // frontend URL set karna hai production me
      methods: ["GET", "POST"],
    },
  });

  io = socketIo;

  io.on('connection', (socket) => {
    console.log('🔗 New client connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('❌ Client disconnected:', socket.id);
    });
  });
}

function getIo() {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
}

module.exports = { initSocket, getIo };
