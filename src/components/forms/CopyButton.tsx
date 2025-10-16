import React from 'react';
import { useTranslation } from 'react-i18next';
import type { SerializedStyles } from '@emotion/utils';

import { Inline } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import CopyIcon from '@atlaskit/icon/core/copy';
import CheckMarkIcon from '@atlaskit/icon/core/check-mark';

type CopyButtonProps = {
  content: string;
  label?: string;
  disabled?: boolean;
  style?: SerializedStyles;
  id?: string;
};

const CopyButton: React.FC<CopyButtonProps> = ({ content, label, disabled, style, id }) => {
  const { t: translate, i18n } = useTranslation();
  const t = translate as (s: string) => string;

  const [showCopy, setShowCopy] = React.useState(true);
  const [message, setMessage] = React.useState(t('copy'));

  const handleCopy = React.useCallback(() => {
    navigator.clipboard
      .writeText(content)
      .then(
        () => {
          setShowCopy(false);
          setMessage(t('copied'));
        },
        () => {
          setMessage(t('copy_failed'));
        }
      )
      .then(() => {
        setTimeout(() => {
          setShowCopy(true);
          setMessage(t('copy'));
        }, 1000);
      });
  }, [i18n.resolvedLanguage, content]);

  return (
    <Tooltip position="top" content={disabled ? '' : message}>
      {(tooltipProps) => (
        <button {...tooltipProps} disabled={disabled} onClick={handleCopy} css={style} id={id}>
          <Inline space="space.100" alignBlock="center">
            {showCopy ? <CopyIcon label="" /> : <CheckMarkIcon color={token('color.icon.success')} label="" />}
            {label}
          </Inline>
        </button>
      )}
    </Tooltip>
  );
};

export default CopyButton;
