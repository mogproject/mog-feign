import { useTranslation } from 'react-i18next';

export interface FileLoaderMessage {
  level: 'info' | 'success' | 'danger';
  message: string;
}

class FileLoader {
  readonly elemForm: HTMLFormElement;
  readonly elemInput: HTMLInputElement;

  contentHandler: (content: string) => boolean;
  messageHandler: (m: FileLoaderMessage) => void;
  extension: string;
  maxFileSizeKb: number = 100;

  constructor(id: string) {
    // i18n
    const { t: translate } = useTranslation('translation', { keyPrefix: 'file' });
    const t = translate as (s: string, o?: Record<string, string | boolean>) => string;

    // Create invisible input element.
    const elemForm = document.createElement('form');
    elemForm.setAttribute('id', id);

    const elemInput: HTMLInputElement = document.createElement('input');
    elemInput.setAttribute('id', id + '-input');
    elemInput.setAttribute('type', 'file');
    elemInput.style.display = 'none'; // hidden object

    // Add event listener
    const handleChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;
      if (!file.name.toLowerCase().endsWith('.' + this.extension)) {
        this.messageHandler({ level: 'danger', message: t('choose_file', { extension: this.extension }) });
        return;
      }
      if (file.size > this.maxFileSizeKb * 1024) {
        this.messageHandler({ level: 'danger', message: t('too_large') });
        return;
      }
      this.messageHandler({ level: 'info', message: `${t('loading')}: ${file.name}` });

      const reader = new FileReader();

      reader.onload = (evt) => {
        if (evt.target?.result) {
          if (this.contentHandler(evt.target?.result.toString())) {
            this.messageHandler({ level: 'success', message: `${t('load_success')}: ${file.name}` });
          } else {
            this.messageHandler({ level: 'danger', message: `${t('load_failure')}: ${file.name}` });
          }
        }
        // This makes an effect when loading the same file path repeatedly.
        target.value = '';
      };
      reader.onerror = () => {
        this.messageHandler({ level: 'danger', message: `${t('load_failure')}: ${file.name}` });
      };

      reader.readAsText(file);
    };
    elemInput.addEventListener('change', handleChange);

    // Add elements to the DOM
    document.body.appendChild(elemForm);
    elemForm.appendChild(elemInput);

    this.elemForm = elemForm;
    this.elemInput = elemInput;
    this.contentHandler = () => true;
    this.messageHandler = () => {};
    this.extension = 'json';
    this.maxFileSizeKb = 100;
  }

  loadTextFromFile(
    contentHandler: (content: string) => boolean,
    messageHandler: (m: FileLoaderMessage) => void,
    extension: string,
    maxFileSizeKb: number = 100
  ) {
    messageHandler({ level: 'info', message: '' });

    // Rewrite fields.
    this.contentHandler = contentHandler;
    this.messageHandler = messageHandler;
    this.extension = extension;
    this.maxFileSizeKb = maxFileSizeKb;

    // Simulate click.
    this.elemInput.click();
  }
}

export default FileLoader;
