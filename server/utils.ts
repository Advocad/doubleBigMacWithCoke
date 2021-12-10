import { config } from 'dotenv';

export function initDotEnv() {
  const envResult = config();

  if (envResult.error) {
    throw envResult.error;
  }
}
