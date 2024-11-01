// File: src/lib/templates/default-templates.ts
import { Template } from '@/lib/types/qr-styles';

export const defaultTemplates: Template[] = [
  // URL Templates
  {
    id: 'url-professional',
    name: 'Professional URL',
    type: 'url',
    description: 'Clean, professional style for business websites',
    style: {
      backgroundColor: '#FFFFFF',
      foregroundColor: '#1F2937',
      margin: 20,
      errorCorrectionLevel: 'Q',
      pattern: 'squares',
      cornerSquareStyle: 'square',
    },
    isPublic: true,
    category: 'business',
    tags: ['professional', 'business', 'url'],
  },
  {
    id: 'url-modern',
    name: 'Modern URL',
    type: 'url',
    description: 'Modern style with rounded patterns',
    style: {
      backgroundColor: '#F8FAFC',
      foregroundColor: '#3B82F6',
      margin: 16,
      errorCorrectionLevel: 'Q',
      pattern: 'dots',
      cornerSquareStyle: 'extra-rounded',
    },
    isPublic: true,
    category: 'modern',
    tags: ['modern', 'stylish', 'url'],
  },

  // WiFi Templates
  {
    id: 'wifi-home',
    name: 'Home WiFi',
    type: 'wifi',
    description: 'Friendly design for home WiFi networks',
    style: {
      backgroundColor: '#ECFDF5',
      foregroundColor: '#059669',
      margin: 24,
      errorCorrectionLevel: 'H',
      pattern: 'rounded',
      cornerSquareStyle: 'dot',
    },
    isPublic: true,
    category: 'personal',
    tags: ['wifi', 'home', 'friendly'],
  },
  {
    id: 'wifi-business',
    name: 'Business WiFi',
    type: 'wifi',
    description: 'Professional style for office WiFi',
    style: {
      backgroundColor: '#F1F5F9',
      foregroundColor: '#0F172A',
      margin: 20,
      errorCorrectionLevel: 'Q',
      pattern: 'squares',
      cornerSquareStyle: 'square',
    },
    isPublic: true,
    category: 'business',
    tags: ['wifi', 'office', 'professional'],
  },

  // VCard Templates
  {
    id: 'vcard-elegant',
    name: 'Elegant Business Card',
    type: 'vcard',
    description: 'Sophisticated design for business professionals',
    style: {
      backgroundColor: '#FFFFFF',
      foregroundColor: '#334155',
      margin: 16,
      errorCorrectionLevel: 'Q',
      pattern: 'rounded',
      cornerSquareStyle: 'extra-rounded',
    },
    isPublic: true,
    category: 'business',
    tags: ['vcard', 'business', 'elegant'],
  },
  {
    id: 'vcard-creative',
    name: 'Creative Contact',
    type: 'vcard',
    description: 'Creative style for artists and designers',
    style: {
      backgroundColor: '#FDF2F8',
      foregroundColor: '#DB2777',
      margin: 20,
      errorCorrectionLevel: 'Q',
      pattern: 'dots',
      cornerSquareStyle: 'dot',
    },
    isPublic: true,
    category: 'creative',
    tags: ['vcard', 'creative', 'artistic'],
  },

  // Email Templates
  {
    id: 'email-minimal',
    name: 'Minimal Email',
    type: 'email',
    description: 'Clean and minimal email contact',
    style: {
      backgroundColor: '#FFFFFF',
      foregroundColor: '#000000',
      margin: 16,
      errorCorrectionLevel: 'M',
      pattern: 'squares',
      cornerSquareStyle: 'square',
    },
    isPublic: true,
    category: 'minimal',
    tags: ['email', 'minimal', 'clean'],
  },
  {
    id: 'email-modern',
    name: 'Modern Email',
    type: 'email',
    description: 'Modern style for email contacts',
    style: {
      backgroundColor: '#EEF2FF',
      foregroundColor: '#4F46E5',
      margin: 20,
      errorCorrectionLevel: 'Q',
      pattern: 'dots',
      cornerSquareStyle: 'extra-rounded',
    },
    isPublic: true,
    category: 'modern',
    tags: ['email', 'modern', 'stylish'],
  },

  // Phone Templates
  {
    id: 'phone-professional',
    name: 'Professional Phone',
    type: 'phone',
    description: 'Professional contact for business cards',
    style: {
      backgroundColor: '#FFFFFF',
      foregroundColor: '#1E40AF',
      margin: 16,
      errorCorrectionLevel: 'Q',
      pattern: 'squares',
      cornerSquareStyle: 'square',
    },
    isPublic: true,
    category: 'business',
    tags: ['phone', 'business', 'professional'],
  },
  {
    id: 'phone-casual',
    name: 'Casual Contact',
    type: 'phone',
    description: 'Friendly style for personal contacts',
    style: {
      backgroundColor: '#FEF3C7',
      foregroundColor: '#D97706',
      margin: 20,
      errorCorrectionLevel: 'Q',
      pattern: 'rounded',
      cornerSquareStyle: 'dot',
    },
    isPublic: true,
    category: 'personal',
    tags: ['phone', 'personal', 'casual'],
  },
];

// Helper function to get templates by type
export function getTemplatesByType(type: string): Template[] {
  return defaultTemplates.filter(template => template.type === type);
}

// Helper function to get templates by category
export function getTemplatesByCategory(category: string): Template[] {
  return defaultTemplates.filter(template => template.category === category);
}

// Helper function to get templates by tag
export function getTemplatesByTag(tag: string): Template[] {
  return defaultTemplates.filter(template => template.tags.includes(tag));
}