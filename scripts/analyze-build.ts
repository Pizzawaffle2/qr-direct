// scripts/analyze-build.ts
import fs from 'fs';
import path from 'path';
import { filesize } from 'filesize';

interface FileAnalysis {
  path: string;
  size: number;
  relativePath: string;
  type: 'page' | 'api' | 'component' | 'lib' | 'style' | 'other';
  used: boolean;
}

interface BuildReport {
  totalSize: number;
  fileCount: number;
  unusedFiles: FileAnalysis[];
  largeFiles: FileAnalysis[];
  duplicateFiles: FileAnalysis[];
}

async function analyzeBuild(): Promise<BuildReport> {
  const projectRoot = process.cwd();
  const buildDir = path.join(projectRoot, '.next');
  const srcDir = path.join(projectRoot, 'src');

  const analysis: FileAnalysis[] = [];
  const report: BuildReport = {
    totalSize: 0,
    fileCount: 0,
    unusedFiles: [],
    largeFiles: [],
    duplicateFiles: [],
  };

  // Function to check if file is used in build
  const isFileUsed = (filePath: string): boolean => {
    const content = fs.readFileSync(filePath, 'utf-8');
    // Analyze imports and usage
    return true; // Implement actual logic
  };

  // Walk through project files
  function walkDir(dir: string) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        walkDir(filePath);
        continue;
      }

      const relativePath = path.relative(projectRoot, filePath);
      const fileType = getFileType(relativePath);
      const size = stat.size;

      analysis.push({
        path: filePath,
        relativePath,
        size,
        type: fileType,
        used: isFileUsed(filePath),
      });
    }
  }

  walkDir(srcDir);

  // Analyze results
  analysis.forEach((file) => {
    report.totalSize += file.size;
    report.fileCount++;

    if (!file.used) {
      report.unusedFiles.push(file);
    }

    if (file.size > 100 * 1024) {
      // Files larger than 100KB
      report.largeFiles.push(file);
    }
  });

  return report;
}

function getFileType(filePath: string): FileAnalysis['type'] {
  if (filePath.startsWith('pages/')) return 'page';
  if (filePath.startsWith('pages/api/')) return 'api';
  if (filePath.startsWith('components/')) return 'component';
  if (filePath.startsWith('lib/')) return 'lib';
  if (filePath.includes('.css') || filePath.includes('.scss')) return 'style';
  return 'other';
}

// Run analysis
analyzeBuild().then((report) => {
  console.log('\nBuild Analysis Report');
  console.log('===================');
  console.log(`Total Size: ${filesize(report.totalSize)}`);
  console.log(`Total Files: ${report.fileCount}`);

  if (report.unusedFiles.length > 0) {
    console.log('\nUnused Files:');
    report.unusedFiles.forEach((file) => {
      console.log(`- ${file.relativePath} (${filesize(file.size)})`);
    });
  }

  if (report.largeFiles.length > 0) {
    console.log('\nLarge Files:');
    report.largeFiles.forEach((file) => {
      console.log(`- ${file.relativePath} (${filesize(file.size)})`);
    });
  }
});
