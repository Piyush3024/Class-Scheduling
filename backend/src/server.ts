import app from './app';
import { connectDatabase } from './config/database.config';
import envConfig from './config/env.config';
import redisClient from './config/redis.config';

const startServer = async () => {
    try {

        await connectDatabase();

        await redisClient.ping();

        const PORT = envConfig.port;
        app.listen(PORT, () => {
            console.log(`
   Server is running on port ${PORT}                   
   Environment: ${envConfig.nodeEnv}                      
   API URL: http://localhost:${PORT}/api              
   Health Check: http://localhost:${PORT}/api/health  
      `);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();