// scripts/fix-quotes.ts
import { glob } from 'glob';
import { readFile, writeFile } from 'fs/promises';

async function fixQuotes() {
  try {
    const files = await glob('src/**/*.{ts,tsx}');

    for (const file of files) {
      let content = await readFile(file, 'utf8');

      // Fix &apos; back to single quotes outside of JSX
      content = content.replace(/&apos;/g, "'");
      
      // Fix &quot; back to double quotes outside of JSX
      content = content.replace(/&quot;/g, '"');

      // Re-escape only within JSX contexts
      content = content.replace(
        /(<[^>]*>[^<]*)'([^']*)'([^<]*<\/[^>]*>)/g,
        (match, openTag, quote, closeTag) => 
          `${openTag}&apos;${quote}&apos;${closeTag}`
      );

      if (content !== await readFile(file, 'utf8')) {
        await writeFile(file, content);
        console.log(`Fixed quotes in ${file}`);
      }
    }
  } catch (error) {
    console.error('Error fixing quotes:', error);
  }
}

fixQuotes();