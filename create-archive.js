const fs = require('fs');
const path = require('path');

// Create a simple archive by copying files to a new directory
const archiveDir = 'angular-components-archive';

// Create archive directory
if (!fs.existsSync(archiveDir)) {
  fs.mkdirSync(archiveDir, { recursive: true });
}

// Files and directories to include
const filesToCopy = [
  'src/',
  'package.json',
  'angular.json',
  'tsconfig.json',
  'tsconfig.app.json',
  'CHECKBOX_COMPONENT_PRD.md'
];

// Function to copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Function to copy file
function copyFile(src, dest) {
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  fs.copyFileSync(src, dest);
}

// Copy all files
filesToCopy.forEach(item => {
  const srcPath = item;
  const destPath = path.join(archiveDir, item);
  
  if (fs.existsSync(srcPath)) {
    const stats = fs.statSync(srcPath);
    if (stats.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
    console.log(`Copied: ${srcPath}`);
  } else {
    console.log(`Skipped (not found): ${srcPath}`);
  }
});

// Create a README file for the archive
const readmeContent = `# Angular Form Components Library

This archive contains a complete Angular form components library with:

## Components Included:
- ✅ Checkbox Component (with all states from Figma)
- ✅ Radio Button Component (with all states from Figma)  
- ✅ Text Field Component (with validation and accessibility)
- ✅ Checkbox Group Component
- ✅ Radio Group Component

## Services Included:
- ✅ Accessibility Service (screen reader support, focus management)
- ✅ Form Validation Service (custom validators)
- ✅ Checkbox State Service
- ✅ Radio State Service

## Features:
- 🎨 Figma design system implementation
- ♿ Full accessibility support (ARIA, keyboard navigation)
- 📱 Responsive design
- 🔧 Angular Reactive Forms integration
- ✅ Comprehensive validation
- 🎯 TypeScript support
- 📋 Complete documentation

## Installation:
1. Extract this archive
2. Run: npm install
3. Run: ng serve
4. Open: http://localhost:4200

## File Structure:
- src/app/components/ - All form components
- src/app/services/ - State management and validation services
- src/main.ts - Demo application
- CHECKBOX_COMPONENT_PRD.md - Product Requirements Document

Created: ${new Date().toISOString()}
`;

fs.writeFileSync(path.join(archiveDir, 'README.md'), readmeContent);

console.log(`\n✅ Archive created successfully in: ${archiveDir}/`);
console.log('📁 Archive contains all source code and configuration files');
console.log('📖 See README.md in the archive for installation instructions');