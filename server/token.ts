import Agora from 'agora-access-token';

type TokenData = {
  isPublisher: boolean;
  channel: string;
};

export function generateTokenController(data: TokenData) {
  const { isPublisher, channel } = data;

  const appID = process.env.APP_ID || '';
  const appCertificate = process.env.APP_CERTIFICATE || '';

  if (!appID) {
    throw new Error('AppID not defined in ENV');
  }

  if (!appCertificate) {
    throw new Error('appCertificate not defined in ENV');
  }

  const uid = Math.floor(Math.random() * 100000);
  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  const role = isPublisher ? Agora.RtcRole.PUBLISHER : Agora.RtcRole.SUBSCRIBER;
  const token = Agora.RtcTokenBuilder.buildTokenWithUid(
    appID,
    appCertificate,
    channel,
    uid,
    role,
    privilegeExpiredTs
  );

  return { uid, token };
}
