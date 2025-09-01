import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Import database connection
import { connectDatabase, disconnectDatabase } from "./config/database";

// Import Socket.IO configuration
import { setupSocketIO } from "./config/socket";

// Import routes
import contactRoutes from "./routes/contact";
import healthRoutes from "./routes/health";
import socketTestRoutes from "./routes/socket-test";
import authRoutes from "./routes/auth";
import projectsRoutes from "./routes/projects";

const app = express();
const PORT = process.env.PORT || 5004; // Use environment variable or default to 5004

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO
const io = setupSocketIO(server);

// Make io accessible in routes
app.set('io', io);

// Security middleware
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https:"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https:"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }),
);

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:8080', // Vite dev server
  'https://builder-aura-field.onrender.com'
];

console.log('Allowed CORS origins:', allowedOrigins);

app.use(
  cors({
    origin: function(origin, callback) {
      console.log('CORS request from origin:', origin);
      
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        console.log('No origin, allowing request');
        return callback(null, true);
      }
      
      if (allowedOrigins.includes(origin)) {
        console.log('Origin allowed:', origin);
        callback(null, true);
      } else {
        console.log('CORS blocked origin:', origin);
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ['Access-Control-Allow-Origin'],
  }),
);

// Add preflight OPTIONS handler for all routes
app.options('*', cors());

// Add explicit CORS headers for all responses
app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log('Setting CORS headers for origin:', origin);
  
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    console.log('Set Access-Control-Allow-Origin to:', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
});


// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// API Routes
app.use("/api/health", healthRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/socket", socketTestRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectsRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "JD Marc Limited API Server",
    version: "1.0.0",
    status: "running",
    timestamp: new Date().toISOString(),
    port: PORT,
    environment: process.env.NODE_ENV || "development",
    cors: {
      allowedOrigins,
      currentOrigin: req.headers.origin
    }
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development"
  });
});

// CORS test endpoint
app.get("/api/cors-test", (req, res) => {
  const origin = req.headers.origin;
  console.log('CORS test request from origin:', origin);
  
  res.json({
    message: "CORS test successful",
    origin: origin,
    allowedOrigins: allowedOrigins,
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    message: `The requested endpoint ${req.originalUrl} does not exist.`,
  });
});

// Global error handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error("Error:", err);

    const status = err.statusCode || err.status || 500;
    const message = err.message || "Internal server error";

    res.status(status).json({
      error: message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  },
);

// Start server with database connection and WebSocket support
const startServer = async () => {
  try {
    // Attempt to connect to Hostinger MySQL database
    // This will not fail the server startup if database is unavailable
    await connectDatabase();

    // Start HTTP server with Socket.IO support
    server.listen(PORT, () => {
      console.log(`🚀 JD Marc API Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🔧 Process ID: ${process.pid}`);
      console.log(`🌍 Host: ${process.env.HOST || "0.0.0.0"}`);

      const baseUrl = process.env.NODE_ENV === 'production'
        ? 'https://builder-aura-field.onrender.com'
        : `http://localhost:${PORT}`;

      console.log(`🌐 API URL: ${baseUrl}`);
      console.log(`🔄 WebSocket enabled: ${baseUrl.replace('http', 'ws')}`);
      console.log('🎯 Ready to handle requests and real-time connections');
      console.log(`🔒 CORS Origins: ${allowedOrigins.join(', ')}`);

      if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD) {
        console.log('\n⚠️  Database not configured. Run: npm run verify-credentials');
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Graceful shutdown initiated...');

  // Close Socket.IO connections
  io.close(() => {
    console.log('🔌 Socket.IO connections closed');
  });

  // Close database connections
  await disconnectDatabase();

  // Close HTTP server
  server.close(() => {
    console.log('🔄 Server closed gracefully');
    process.exit(0);
  });
});

process.on('SIGTERM', async () => {
  console.log('\n🔄 Graceful shutdown initiated...');

  // Close Socket.IO connections
  io.close(() => {
    console.log('🔌 Socket.IO connections closed');
  });

  // Close database connections
  await disconnectDatabase();

  // Close HTTP server
  server.close(() => {
    console.log('🔄 Server closed gracefully');
    process.exit(0);
  });
});

// Start the server
startServer();

export default app;
