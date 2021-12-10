import { ServerOptions } from 'socket.io';

export function getConfig() {
  return {
    port: process.env.PORT || 3001,
    appId: process.env.APP_ID,
    appCertificate: process.env.APP_CERTIFICATE,
    mongoUrl: process.env.MONGODB_URI || 'localhost',
    // mongoPort: process.env.MONGODB_PORT || '27017',
    // mongoUser: process.env.MONGODB_USER || 'burger',
    // mongoPass: process.env.MONGODB_USER || 'WwDxJaFz2DEXrv6',
    dbName: process.env.DB_NAME || 'test',
    mode: process.env.NODE_ENV || 'development',
  };
}

export function getDbConnectionString(dbName: string) {
  return getConfig().mongoUrl;
  // const { mongoPort, mongoUrl, mongoPass, mongoUser } = getConfig();
  // return `mongodb+src://${mongoUser}:${mongoPass}${mongoUrl}:${mongoPort}/${dbName}`;
}

export function getSocketConfig(): Partial<ServerOptions> {
  return {};
}
