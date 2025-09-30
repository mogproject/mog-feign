import { useTranslation } from 'react-i18next';

export interface FileLoaderMessage {
  level: 'info' | 'success' | 'danger';
  message: string;
}

class FileLoader {
  t: (s: string, o?: Record<string, string | boolean>) => string;

  constructor() {
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
}

export default FileLoader;
