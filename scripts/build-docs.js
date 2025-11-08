#!/usr/bin/env node

/**
 * Build documentation for GitHub Pages
 * Converts markdown files to HTML
 */

import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const docsDir = join(rootDir, 'docs');
const buildDir = join(rootDir, 'docs-build');

// Simple markdown to HTML converter
function markdownToHTML(markdown) {
  let html = markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    // Code blocks
    .replace(/```(\w+)?\n([\s\S]*?)```/gim, '<pre><code class="language-$1">$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/gim, '<code>$1</code>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>')
    // Lists
    .replace(/^\* (.*$)/gim, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    // Paragraphs
    .replace(/\n\n/gim, '</p><p>')
    .replace(/^(?!<[h|u|l|p|d|s])/gim, '<p>')
    .replace(/(?![h|u|l|p|d|s]>)$/gim, '</p>');

  return html;
}

function createHTMLPage(title, content, currentPath = '') {
  const navLinks = [
    { name: 'Getting Started', path: 'getting-started.html' },
    { name: 'OpenAPI Guide', path: 'openapi-guide.html' },
    { name: 'agents.json Guide', path: 'agents-json-guide.html' },
    { name: 'Frontend Components', path: 'frontend-components.html' },
    { name: 'Developer Events', path: 'developer-events.html' },
    { name: 'API Reference', path: 'api-reference.html' },
  ];

  const navHTML = navLinks
    .map(
      (link) =>
        `<a href="${currentPath}${link.path}" class="nav-link">${link.name}</a>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Toon Agent Bridge</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
        }
        
        .container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
        }
        
        header {
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            color: white;
            padding: 40px 20px;
            text-align: center;
            margin-bottom: 40px;
        }
        
        header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
        }
        
        header a {
            color: white;
            text-decoration: none;
        }
        
        nav {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .nav-links {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        
        .nav-link {
            display: inline-block;
            padding: 8px 16px;
            background: #6366f1;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-size: 0.9rem;
            transition: background 0.2s;
        }
        
        .nav-link:hover {
            background: #4f46e5;
        }
        
        .content {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            line-height: 1.8;
        }
        
        .content h1 {
            color: #6366f1;
            margin-bottom: 20px;
            font-size: 2rem;
        }
        
        .content h2 {
            color: #6366f1;
            margin: 30px 0 15px;
            font-size: 1.5rem;
        }
        
        .content h3 {
            color: #6366f1;
            margin: 20px 0 10px;
            font-size: 1.2rem;
        }
        
        .content p {
            margin-bottom: 15px;
            color: #666;
        }
        
        .content code {
            background: #f1f5f9;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 0.9rem;
        }
        
        .content pre {
            background: #1e293b;
            color: #f1f5f9;
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 20px 0;
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 0.9rem;
        }
        
        .content pre code {
            background: transparent;
            padding: 0;
            color: inherit;
        }
        
        .content ul, .content ol {
            margin: 15px 0 15px 30px;
        }
        
        .content li {
            margin-bottom: 8px;
            color: #666;
        }
        
        .content a {
            color: #6366f1;
            text-decoration: none;
        }
        
        .content a:hover {
            text-decoration: underline;
        }
        
        footer {
            text-align: center;
            padding: 40px 20px;
            color: #666;
            margin-top: 60px;
        }
    </style>
</head>
<body>
    <header>
        <h1><a href="index.html">Toon Agent Bridge</a></h1>
        <p>Universal bridge for agent schemas</p>
    </header>
    
    <div class="container">
        <nav>
            <div class="nav-links">
                ${navHTML}
            </div>
        </nav>
        
        <div class="content">
            ${content}
        </div>
    </div>
    
    <footer>
        <p>Toon Agent Bridge - MIT License</p>
        <p><a href="https://github.com/yourusername/toon-package">GitHub</a> | <a href="https://www.npmjs.com/org/toon">NPM</a></p>
    </footer>
</body>
</html>`;
}

async function buildDocs() {
  try {
    // Create build directory
    if (!existsSync(buildDir)) {
      await mkdir(buildDir, { recursive: true });
    }

  const markdownFiles = [
    'getting-started.md',
    'openapi-guide.md',
    'agents-json-guide.md',
    'frontend-components.md',
    'developer-events.md',
    'api-reference.md',
  ];

  // Copy index.html
  const indexHTML = await readFile(join(docsDir, 'index.html'), 'utf-8');
  await writeFile(join(buildDir, 'index.html'), indexHTML);

  // Convert markdown files to HTML
  for (const file of markdownFiles) {
    const markdownPath = join(docsDir, file);
    const markdown = await readFile(markdownPath, 'utf-8');
    const html = markdownToHTML(markdown);
    const title = file.replace('.md', '').replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    const pageHTML = createHTMLPage(title, html);
    const outputPath = join(buildDir, file.replace('.md', '.html'));
    await writeFile(outputPath, pageHTML);
    console.log(`Built: ${file} -> ${file.replace('.md', '.html')}`);
  }

  console.log('Documentation built successfully!');
  } catch (error) {
    console.error('Error building docs:', error);
    process.exit(1);
  }
}

buildDocs();

