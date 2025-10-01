import React from 'react';
import { useTranslation } from 'react-i18next';
import invariant from 'tiny-invariant';

export interface FileLoaderMessage {
  level: 'info' | 'success' | 'danger';
  message: string;
}

class FileLoader {
  readonly isFileSystemAccessApiSupported: boolean;
  readonly inputId: string;
  t: (s: string, o?: Record<string, string | boolean>) => string;

  constructor() {
    this.isFileSystemAccessApiSupported = !!window.showOpenFilePicker;
    this.inputId = this.isFileSystemAccessApiSupported ? '' : React.useId();

    // i18n
    const { t: translate } = useTranslation('translation', { keyPrefix: 'file' });
    const t = translate as (s: string, o?: Record<string, string | boolean>) => string;
    this.t = t;
  }

  loadTextFromFile(
    contentHandler: (content: string) => boolean,
    messageHandler: (m: FileLoaderMessage) => void,
    extension: string,
    maxFileSizeKb: number = 100
  ) {
    messageHandler({ level: 'info', message: '' });
    if (!this.isFileSystemAccessApiSupported) {
      this.loadTextFromFileLegacy(contentHandler, messageHandler, extension, maxFileSizeKb);
      return;
    }

    window
      .showOpenFilePicker({
        multiple: false,
        types: [
          {
            description: this.t('text_files'),
            accept: { 'text/plain': [`.${extension}`] },
          },
        ],
      })
      .then(([fileHandle]) => fileHandle.getFile())
      .then((file) => {
        if (!file.name.toLowerCase().endsWith('.' + extension)) {
          throw Error(this.t('choose_file', { extension: extension }));
        }
        if (file.size > maxFileSizeKb * 1024) {
          throw Error(this.t('too_large'));
        }

        // read content
        messageHandler({ level: 'info', message: `${this.t('loading')}: ${file.name}` });
        return file.text().then((text) => ({
          name: file.name,
          content: text,
        }));
      })
      .then(({ name, content }) => {
        if (contentHandler(content)) {
          messageHandler({ level: 'success', message: `${this.t('load_success')}: ${name}` });
        } else {
          messageHandler({ level: 'danger', message: `${this.t('load_failure')}: ${name}` });
        }
      })
      .catch((err: Error) => {
        if (err.name === 'AbortError') {
          // canceled by user; do nothing
        } else {
          messageHandler({ level: 'danger', message: err.message });
        }
      });
  }

  loadTextFromFileLegacy(
    contentHandler: (content: string) => boolean,
    messageHandler: (m: FileLoaderMessage) => void,
    extension: string,
    maxFileSizeKb: number = 100
  ) {
    // Check if the input element already exists.
    const elemInputFound = document.getElementById(this.inputId) as HTMLInputElement | null;
    var elemInput: HTMLInputElement;
    if (elemInputFound === null) {
      // Create a hidden input element.
      const elem = document.createElement('input');
      elem.type = 'file';
      elem.id = this.inputId;
      elem.accept = `.${extension}`;
      elem.style.display = 'none';

      // Add elements to the DOM
      document.body.appendChild(elem);
      elemInput = elem;
    } else {
      elemInput = elemInputFound;
    }

    // Define the onChange event.
    elemInput.onchange = () => {
      // Determine a file to read.
      const file = elemInput.files?.[0] ?? null;
      if (!file) {
        // selected no files
      } else if (!file.name.toLowerCase().endsWith('.' + extension)) {
        messageHandler({ level: 'danger', message: this.t('choose_file', { extension: extension }) });
      } else if (file.size > maxFileSizeKb * 1024) {
        messageHandler({ level: 'danger', message: this.t('too_large') });
      } else {
        messageHandler({ level: 'info', message: `${this.t('loading')}: ${file.name}` });

        // Load the content.
        const reader = new FileReader();
        reader.onload = (evt) => {
          if (evt.target?.result) {
            // Main process
            if (contentHandler(evt.target?.result.toString())) {
              messageHandler({ level: 'success', message: `${this.t('load_success')}: ${file.name}` });
            } else {
              messageHandler({ level: 'danger', message: `${this.t('load_failure')}: ${file.name}` });
            }
          }
        };
        reader.onerror = () => {
          messageHandler({ level: 'danger', message: `${this.t('load_failure')}: ${file.name}` });
        };

        reader.readAsText(file);
      }
    };

    // This makes an effect when loading the same file path repeatedly.
    elemInput.value = '';
    elemInput.click();
  }
}

export default FileLoader;
