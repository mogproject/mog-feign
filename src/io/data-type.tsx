export type DataTypeResult = {
  description: string;
  accept: Record<MIMEType, FileExtension | FileExtension[]>;
  acceptLegacy: string;
};

export function getDataType(extension: string): DataTypeResult {
  if (extension.toLowerCase() === 'txt') {
    return {
      description: 'Text file',
      accept: { 'text/plain': '.txt' },
      acceptLegacy: 'text/plain;charset=utf-8',
    };
  }
  if (extension === 'json') {
    return {
      description: 'JSON file',
      accept: { 'application/json': '.json' },
      acceptLegacy: 'application/json;charset=utf-8',
    };
  }
  if (extension === 'css') {
    return {
      description: 'CSS file',
      accept: { 'text/css': '.css' },
      acceptLegacy: 'text/css;charset=utf-8',
    };
  }
  // fallback
  return {
    description: 'Unknown',
    accept: { 'text/plain': `.${extension}` },
    acceptLegacy: 'text/plain;charset=utf-8',
  };
}
