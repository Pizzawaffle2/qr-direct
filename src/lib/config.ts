// lib/config.ts
import {SecretsManager } from './secrets';

interface DatabaseConfig {
  username: string;
  password: string;
  host: string;
}

interface StripeConfig {
  secretKey: string;
  webhookSecret: string;
}

export class AppConfig {
  private secrets: SecretsManager;
  private environment: string;
  private secretsPath: string;

  constructor() {
    this.secrets = new SecretsManager(process.env.AWS_REGION);
    this.environment = process.env.NODE_ENV || 'development';
    this.secretsPath = `/qr-direct/${this.environment}`;
  }

  async getDatabaseConfig(): Promise<DatabaseConfig> {
    const dbSecret = await this.secrets.getSecret(`${this.secretsPath}/database`);
    return JSON.parse(dbSecret);
  }

  async getStripeConfig(): Promise<StripeConfig> {
    const stripeSecret = await this.secrets.getSecret(`${this.secretsPath}/stripe`);
    return JSON.parse(stripeSecret);
  }

  async loadConfig(): Promise<void> {
    try {
      // Load all parameters from SSM
      const parameters = await this.secrets.getAllParameters(this.secretsPath);

      // Load secrets from Secrets Manager
      const [dbConfig, stripeConfig] = await Promise.all([
        this.getDatabaseConfig(),
        this.getStripeConfig(),
      ]);

      // Set environment variables
      process.env.DATABASE_URL = `postgresql://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}/qr_direct`;
      process.env.STRIPE_SECRET_KEY = stripeConfig.secretKey;
      process.env.STRIPE_WEBHOOK_SECRET = stripeConfig.webhookSecret;

      // Set parameters from SSM
      Object.entries(parameters).forEach(([key, value]) => {
        process.env[key] = value;
      });
    } catch (error) {
      console.error('Error loading configuration:', error);
      throw error;
    }
  }
}
