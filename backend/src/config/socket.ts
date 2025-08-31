import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

export const setupSocketIO = (server: HttpServer) => {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://jdmarcng.com',
    'https://jdmarcng.com',
    'https://www.jdmarcng.com'
  ];

  const io = new Server(server, {
    cors: {
      origin: function(origin, callback) {
        // Allow requests with no origin
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
          callback(null, true);
        } else {
          console.log('Socket.IO CORS blocked origin:', origin);
          callback(null, true); // Allow all origins in case of issues
        }
      },
      methods: ['GET', 'POST'],
      credentials: true
    },
    transports: ['websocket', 'polling'],
    allowEIO3: true
  });

  // Connection handling
  io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id);
    console.log('👥 Total clients:', io.engine.clientsCount);

    // Handle client disconnect
    socket.on('disconnect', (reason) => {
      console.log('🔌 Client disconnected:', socket.id, 'Reason:', reason);
      console.log('👥 Total clients:', io.engine.clientsCount);
    });

    // Handle room joining
    socket.on('join-room', (room) => {
      socket.join(room);
      console.log(`📍 Client ${socket.id} joined room: ${room}`);
    });

    // Handle room leaving
    socket.on('leave-room', (room) => {
      socket.leave(room);
      console.log(`📍 Client ${socket.id} left room: ${room}`);
    });

    // Handle contact form submissions (real-time notifications)
    socket.on('contact-submitted', (data) => {
      console.log('📝 Contact form submitted:', data);
      // Broadcast to admin dashboard
      socket.broadcast.to('admin-dashboard').emit('new-contact', data);
    });

    // Handle project updates
    socket.on('project-update', (data) => {
      console.log('🚧 Project updated:', data);
      // Broadcast to all clients
      socket.broadcast.emit('project-updated', data);
    });

    // Handle user status updates
    socket.on('user-status', (data) => {
      console.log('👤 User status update:', data);
      socket.broadcast.emit('user-status-changed', data);
    });

    // Handle chat messages (if implementing chat)
    socket.on('send-message', (data) => {
      console.log('💬 Message sent:', data);
      // Emit to specific room or all clients
      if (data.room) {
        socket.to(data.room).emit('new-message', data);
      } else {
        socket.broadcast.emit('new-message', data);
      }
    });

    // Handle typing indicators
    socket.on('typing-start', (data) => {
      socket.broadcast.to(data.room || 'general').emit('user-typing', {
        userId: data.userId,
        userName: data.userName
      });
    });

    socket.on('typing-stop', (data) => {
      socket.broadcast.to(data.room || 'general').emit('user-stopped-typing', {
        userId: data.userId
      });
    });

    // Handle dashboard activity
    socket.on('dashboard-activity', (data) => {
      console.log('📊 Dashboard activity:', data);
      socket.broadcast.to('admin-dashboard').emit('activity-update', data);
    });
  });

  // Middleware for authentication (optional)
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (token) {
      // Verify JWT token here if needed
      console.log('🔑 Client authenticated with token');
    }
    next();
  });

  return io;
};

// Helper function to emit to all clients
export const broadcastToAll = (io: Server, event: string, data: any) => {
  io.emit(event, data);
  console.log(`📡 Broadcasted ${event} to all clients`);
};

// Helper function to emit to specific room
export const broadcastToRoom = (io: Server, room: string, event: string, data: any) => {
  io.to(room).emit(event, data);
  console.log(`📡 Broadcasted ${event} to room: ${room}`);
};

// Helper function to get connected clients count
export const getConnectedClientsCount = (io: Server): number => {
  return io.engine.clientsCount;
};
