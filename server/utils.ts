import { config } from 'dotenv';

export function initDotEnv() {
  const envResult = config();

  if (envResult.error) {
    console.log(envResult.error);
  }
}
