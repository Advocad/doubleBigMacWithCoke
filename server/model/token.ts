import Agora from 'agora-access-token';
import { getConfig } from '../config';

type TokenData = {
  isPublisher: boolean;
  channel: string;
};

export function generateToken(data: TokenData) {
  const { isPublisher, channel } = data;

  const { appId, appCertificate } = getConfig();

  if (!appId) {
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
    appId,
    appCertificate,
    channel,
    uid,
    role,
    privilegeExpiredTs
  );

  return { uid, token };
}
