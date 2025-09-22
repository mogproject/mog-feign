import React from 'react';
import { useTranslation } from 'react-i18next';
import { css } from '@emotion/react';

import { Inline } from '@atlaskit/primitives';
import Textfield from '@atlaskit/textfield';

import { buttonGroupNotFirstStyles, buttonGroupNotLastStyles, labelStyles } from '../../forms/button-group-styles';
import ColorPicker from '../../forms/ColorPicker';

type TextSettings = {
  fontSize: number;
  fontColor: string;
  backgroundColor: string;
};

type TextSettingsButtonsProps = TextSettings & {
  onChange: (settings: Partial<TextSettings>) => void;
};

const TextSettingsButtons: React.FC<TextSettingsButtonsProps> = ({ fontSize, fontColor, backgroundColor, onChange }) => {
  const { t: translate } = useTranslation('translation', { keyPrefix: 'settings.overlay' });
  const t = translate as (s: string, o?: Record<string, string | boolean>) => string;
  const tt = (k: string) => {
    return t(k, { keyPrefix: '' });
  };
  const textFieldStylesInner = {
    borderRadius: '0',
    marginLeft: '-1px',
  };
  const textFieldStyles = css(textFieldStylesInner);
  const textFieldClass = `css-${textFieldStyles.name}`;

  return (
    <Inline alignBlock="center">
      <label htmlFor="username-fontsize" css={[labelStyles, buttonGroupNotLastStyles]}>
        {t('size')}
      </label>
      <span css={css({ [`.${textFieldClass}`]: textFieldStylesInner })}>
        <Textfield
          id="username-fontsize"
          type="number"
          min={10}
          max={50}
          width={60}
          value={fontSize}
          isCompact
          className={textFieldClass}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            onChange({ fontSize: parseInt(e.target.value) });
          }}
        />
      </span>

      <label htmlFor="username-fontcolor" css={[labelStyles, buttonGroupNotFirstStyles, buttonGroupNotLastStyles]}>
        {tt('color')}
      </label>
      <ColorPicker
        id="username-fontcolor"
        title={t('font_color')}
        value={fontColor}
        isNotFirstOfGroup
        isNotLastOfGroup
        onChange={(color) => onChange({ fontColor: color })}
      />

      <label htmlFor="username-bgcolor" css={[labelStyles, buttonGroupNotFirstStyles, buttonGroupNotLastStyles]}>
        {t('background_color')}
      </label>
      <ColorPicker
        id="username-bgcolor"
        title={t('background_color')}
        value={backgroundColor}
        isNotFirstOfGroup
        onChange={(color) => onChange({ backgroundColor: color })}
      />
    </Inline>
  );
};

export default TextSettingsButtons;
