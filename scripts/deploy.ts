// scripts/deploy.ts
import { execSync } from 'child_process';

const deploy = async (environment: 'staging' | 'production') => {
  try {
    // Build the image
    console.log(`Building ${environment} image...`);
    execSync(`docker build -t qr-direct:${environment} .`);

    // Push to registry (example with AWS ECR)
    console.log('Pushing to registry...');
    execSync(`docker tag qr-direct:${environment} ${process.env.ECR_REGISTRY}/qr-direct:${environment}`);
    execSync(`docker push ${process.env.ECR_REGISTRY}/qr-direct:${environment}`);

    console.log('Deployment complete!');
  } catch (error) {
    console.error('Deployment failed:', error);
    process.exit(1);
  }
};

// Run deployment
const environment = process.argv[2] as 'staging' | 'production';
if (!environment || !['staging', 'production'].includes(environment)) {
  console.error('Please specify environment: staging or production');
  process.exit(1);
}

deploy(environment);