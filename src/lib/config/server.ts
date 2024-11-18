// lib/config/server.ts
import { SecretsManager } from './secrets';

export class ServerConfig {
  private static instance: ServerConfig;
  private secrets: SecretsManager;
  private environment: string;
  private secretsPath: string;
  private configCache: Map<string, any> = new Map();

  private constructor() {
    this.secrets = new SecretsManager(process.env.AWS_REGION);
    this.environment = process.env.NODE_ENV || 'development';
    this.secretsPath = `/qr-direct/${this.environment}`;
  }

  public static getInstance(): ServerConfig {
    if (!ServerConfig.instance) {
      ServerConfig.instance = new ServerConfig();
    }
    return ServerConfig.instance;
  }

  async getSecret(path: string): Promise<any> {
    if (this.configCache.has(path)) {
      return this.configCache.get(path);
    }

    const secret = await this.secrets.getSecret(`${this.secretsPath}/${path}`);
    const parsed = JSON.parse(secret);
    this.configCache.set(path, parsed);
    return parsed;
  }

  async getParameter(name: string): Promise<string> {
    if (this.configCache.has(name)) {
      return this.configCache.get(name);
    }

    const value = await this.secrets.getParameter(`${this.secretsPath}/${name}`);
    this.configCache.set(name, value);
    return value;
  }
}

// Create a client-safe config for public values
// lib/config/client.ts
export const ClientConfig = {
  appName: process.env.NEXT_PUBLIC_APP_NAME,
  appUrl: process.env.NEXT_PUBLIC_APP_URL,
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  // Add other public env vars here
};