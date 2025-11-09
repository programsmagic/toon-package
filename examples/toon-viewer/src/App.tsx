import React, { useState } from 'react';
import { FormatViewer, FileDropZone } from '@programsmagic/toon-viewer';
import '@programsmagic/toon-viewer/styles';

function App() {
  const [content, setContent] = useState('{"user": {"id": 123, "name": "Ada", "tags": ["reading", "gaming"], "active": true}}');
  const [format, setFormat] = useState<'json' | 'toon' | 'csv' | 'yaml'>('json');

  const handleFileLoad = (fileContent: string, filename: string) => {
    setContent(fileContent);
    // Auto-detect format from filename
    if (filename.endsWith('.json')) setFormat('json');
    else if (filename.endsWith('.toon')) setFormat('toon');
    else if (filename.endsWith('.csv')) setFormat('csv');
    else if (filename.endsWith('.yaml') || filename.endsWith('.yml')) setFormat('yaml');
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '1rem', background: '#252526', borderBottom: '1px solid #3e3e42' }}>
        <h1 style={{ margin: 0, color: '#d4d4d4' }}>TOON Format Viewer</h1>
        <p style={{ margin: '0.5rem 0 0', color: '#858585', fontSize: '0.875rem' }}>
          Drag & drop a file or use the viewer below
        </p>
      </header>

      <div style={{ margin: '1rem' }}>
        <FileDropZone onFileLoad={handleFileLoad}>
          <p style={{ color: '#858585', margin: 0 }}>Drag & drop a file here, or click to select</p>
        </FileDropZone>
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
        <FormatViewer
          initialContent={content}
          initialFormat={format}
          showTokenCounter={true}
          showFormatSelector={true}
          llmMode={true}
          model="gpt-4"
        />
      </div>
    </div>
  );
}

export default App;

