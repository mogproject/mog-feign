import { getDataType } from './data-type';

class FileSaver {
  readonly isFileSystemAccessApiSupported: boolean;

  constructor() {
    this.isFileSystemAccessApiSupported = !!window.showSaveFilePicker;
  }

  async saveTextToFile(content: () => string, suggestedName: string) {
    if (!this.isFileSystemAccessApiSupported) {
      this.saveTextToFileLegacy(content, suggestedName);
      return;
    }

    const ext = suggestedName.split('.').pop()?.toLowerCase() || '';
    try {
      // Open the file save dialog.
      const accept = getDataType(ext);
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: suggestedName,
        types: [{ description: accept.description, accept: accept.accept }],
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

  /** For browsers that do support File System Access API (e.g. Firefox). */
  saveTextToFileLegacy(content: () => string, suggestedName: string) {
    const ext = suggestedName.split('.').pop()?.toLowerCase() || '';

    const accept = getDataType(ext);
    const file = new Blob([content()], { type: accept.acceptLegacy });
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
