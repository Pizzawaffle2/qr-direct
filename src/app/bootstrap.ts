// app/bootstrap.ts
import {AppConfig } from '@/lib/config';

export async function bootstrap() {
  const config = new AppConfig();
  await config.loadConfig();
}
