// src/config/amplify.ts
import {Amplify } from 'aws-amplify';
import config from '@/amplifyconfiguration.json';

Amplify.configure(config);