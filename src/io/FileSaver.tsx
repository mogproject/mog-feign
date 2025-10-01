class FileSaver {
  readonly isFileSystemAccessApiSupported: boolean;

  constructor() {
    this.isFileSystemAccessApiSupported = !!window.showSaveFilePicker;
  }

  inferDataType(extension: string): FilePickerAcceptType {
    if (extension === 'txt') return { description: 'Text file', accept: { 'text/plain': ['.txt'] } };
    if (extension === 'json') return { description: 'JSON file', accept: { 'application/json': ['.json'] } };
    if (extension === 'css') return { description: 'CSS file', accept: { 'text/css': ['.css'] } };

    // not implemented yet
    return { description: 'Unknown', accept: {} };
  }

  inferDataTypeLegacy(extension: string): string {
    if (extension === 'txt') return 'text/plain;charset=utf-8';
    if (extension === 'json') return 'application/json;charset=utf-8';
    if (extension === 'css') return 'text/css;charset=utf-8';

    // not implemented yet
    return 'text/plain;charset=utf-8';
  }

  async saveTextToFile(content: () => string, suggestedName: string) {
    if (!this.isFileSystemAccessApiSupported) {
      this.saveTextToFileLegacy(content, suggestedName);
      return;
    }

    const ext = suggestedName.split('.').pop()?.toLowerCase() || '';
    try {
      // Open the file save dialog.
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: suggestedName,
        types: [this.inferDataType(ext)],
      });

      // Create a writable stream to the file
      const writableStream = await fileHandle.createWritable();

      // Write content to the file
      await writableStream.write(content());

      // Close the stream to save the file
      await writableStream.close();
    } catch (error) {
      // Do nothing
    }
  }

  /** For browsers that do support File System Access API. */
  saveTextToFileLegacy(content: () => string, suggestedName: string) {
    const ext = suggestedName.split('.').pop()?.toLowerCase() || '';

    const file = new Blob([content()], { type: this.inferDataTypeLegacy(ext) });
    const url = URL.createObjectURL(file);

    const element = document.createElement('a');
    element.href = url;
    element.download = suggestedName;

    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element); // Clean up the anchor element

    setTimeout(() => URL.revokeObjectURL(url), 100);
  }
}

export default FileSaver;
