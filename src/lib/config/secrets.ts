// src/lib/config/secrets.ts
import {SecretsManagerClient,
  GetSecretValueCommand,
  GetSecretValueCommandInput,
} from '@aws-sdk/client-secrets-manager';
import {SSMClient, GetParameterCommand, GetParametersByPathCommand } from '@aws-sdk/client-ssm';

export class SecretsManager {
  private secretsClient: SecretsManagerClient;
  private ssmClient: SSMClient;
  private cache: Map<string, { value: string; timestamp: number }>;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor(region: string = process.env.AWS_REGION || 'us-east-1') {
    // In development, use mock clients if AWS credentials aren't available
    if (process.env.NODE_ENV === 'development' && !process.env.AWS_ACCESS_KEY_ID) {
      this.secretsClient = this.createMockSecretsClient();
      this.ssmClient = this.createMockSSMClient();
    } else {
      this.secretsClient = new SecretsManagerClient({ region });
      this.ssmClient = new SSMClient({ region });
    }

    this.cache = new Map();
  }

  async getSecret(secretName: string): Promise<string> {
    // Check cache first
    const cached = this.cache.get(secretName);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.value;
    }

    try {
      if (process.env.NODE_ENV === 'development') {
        return this.getDevelopmentSecret(secretName);
      }

      const input: GetSecretValueCommandInput = {
        SecretId: secretName,
      };

      const command = new GetSecretValueCommand(input);
      const response = await this.secretsClient.send(command);
      const secretValue = response.SecretString || '';

      // Update cache
      this.cache.set(secretName, {
        value: secretValue,
        timestamp: Date.now(),
      });

      return secretValue;
    } catch (error) {
      console.error(`Error fetching secret ${secretName}:`, error);
      return this.getDevelopmentSecret(secretName);
    }
  }

  async getParameter(parameterName: string): Promise<string> {
    try {
      if (process.env.NODE_ENV === 'development') {
        return process.env[parameterName] || '';
      }

      const command = new GetParameterCommand({
        Name: parameterName,
        WithDecryption: true,
      });

      const response = await this.ssmClient.send(command);
      return response.Parameter?.Value || '';
    } catch (error) {
      console.error(`Error fetching parameter ${parameterName}:`, error);
      return process.env[parameterName] || '';
    }
  }

  async getAllParameters(path: string): Promise<Record<string, string>> {
    try {
      if (process.env.NODE_ENV === 'development') {
        return this.getDevelopmentParameters();
      }

      const command = new GetParametersByPathCommand({
        Path: path,
        Recursive: true,
        WithDecryption: true,
      });

      const response = await this.ssmClient.send(command);
      const parameters: Record<string, string> = {};

      response.Parameters?.forEach((param) => {
        if (param.Name && param.Value) {
          const name = param.Name.split('/').pop() || '';
          parameters[name] = param.Value;
        }
      });

      return parameters;
    } catch (error) {
      console.error(`Error fetching parameters from path ${path}:`, error);
      return this.getDevelopmentParameters();
    }
  }

  private getDevelopmentSecret(secretName: string): string {
    // Return development values based on the secret name
    const secrets: Record<string, string> = {
      '/qr-direct/development/database': JSON.stringify({
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
        host: process.env.DB_HOST || 'localhost',
      }),
      '/qr-direct/development/stripe': JSON.stringify({
        secretKey: process.env.STRIPE_SECRET_KEY || '',
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
      }),
    };

    return secrets[secretName] || '';
  }

  private getDevelopmentParameters(): Record<string, string> {
    // Return all environment variables that don't start with NEXT_PUBLIC_
    const params: Record<string, string> = {};
    Object.entries(process.env).forEach(([key, value]) => {
      if (value && !key.startsWith('NEXT_PUBLIC_')) {
        params[key] = value;
      }
    });
    return params;
  }

  private createMockSecretsClient(): SecretsManagerClient {
    return {
      send: async (command: GetSecretValueCommand) => {
        const secretName = command.input.SecretId;
        return {
          SecretString: this.getDevelopmentSecret(secretName as string),
        };
      },
    } as unknown as SecretsManagerClient;
  }

  private createMockSSMClient(): SSMClient {
    return {
      send: async (command: any) => {
        if (command instanceof GetParameterCommand) {
          return {
            Parameter: {
              Value: process.env[command.input.Name || ''] || '',
            },
          };
        }
        if (command instanceof GetParametersByPathCommand) {
          const params = this.getDevelopmentParameters();
          return {
            Parameters: Object.entries(params).map(([Name, Value]) => ({
              Name,
              Value,
            })),
          };
        }
      },
    } as unknown as SSMClient;
  }
}
