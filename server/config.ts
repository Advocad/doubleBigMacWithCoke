export function getConfig() {
  return {
    port: process.env.PORT || 3001,
    appId: process.env.APP_ID,
    appCertificate: process.env.APP_CERTIFICATE,
  };
}
