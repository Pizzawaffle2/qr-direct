// lib/secrets.ts
import {SecretsManagerClient,
  GetSecretValueCommand,
  UpdateSecretCommand,
} from '@aws-sdk/client-secrets-manager';
import {SSMClient, GetParameterCommand, GetParametersByPathCommand } from '@aws-sdk/client-ssm';

export class SecretsManager {
  private secretsClient: SecretsManagerClient;
  private ssmClient: SSMClient;
  private cache: Map<string, { value: string; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor(region: string = 'us-east-1') {
    this.secretsClient = new SecretsManagerClient({ region });
    this.ssmClient = new SSMClient({ region });
  }

  async getSecret(secretName: string): Promise<string> {
    const cached = this.cache.get(secretName);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.value;
    }

    try {
      const command = new GetSecretValueCommand({ SecretId: secretName });
      const response = await this.secretsClient.send(command);
      const secretValue = response.SecretString || '';

      this.cache.set(secretName, {
        value: secretValue,
        timestamp: Date.now(),
      });

      return secretValue;
    } catch (error) {
      console.error(`Error fetching secret ${secretName}:`, error);
      throw error;
    }
  }

  async getParameter(parameterName: string, decrypt: boolean = true): Promise<string> {
    try {
      const command = new GetParameterCommand({
        Name: parameterName,
        WithDecryption: decrypt,
      });

      const response = await this.ssmClient.send(command);
      return response.Parameter?.Value || '';
    } catch (error) {
      console.error(`Error fetching parameter ${parameterName}:`, error);
      throw error;
    }
  }

  async getAllParameters(path: string): Promise<Record<string, string>> {
    try {
      const command = new GetParametersByPathCommand({
        Path: path,
        Recursive: true,
        WithDecryption: true,
      });

      const response = await this.ssmClient.send(command);
      const parameters: Record<string, string> = {};

      response.Parameters?.forEach((param) => {
        if (param.Name && param.Value) {
          parameters[param.Name.replace(path + '/', '')] = param.Value;
        }
      });

      return parameters;
    } catch (error) {
      console.error(`Error fetching parameters from path ${path}:`, error);
      throw error;
    }
  }
}
