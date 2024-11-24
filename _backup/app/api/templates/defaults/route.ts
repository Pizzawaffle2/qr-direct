// File: src/app/api/templates/defaults/route.ts
import { NextResponse } from 'next/server';
import {
  defaultTemplates,
  getTemplatesByType,
  getTemplatesByCategory,
  getTemplatesByTag,
} from '@/lib/templates/default-templates';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');

    let templates = defaultTemplates;

    if (type) {
      templates = getTemplatesByType(type);
    } else if (category) {
      templates = getTemplatesByCategory(category);
    } else if (tag) {
      templates = getTemplatesByTag(tag);
    }

    return NextResponse.json(templates);
  } catch (error) {
    return new Response('Failed to fetch templates', { status: 500 });
  }
}
