import React from 'react';
import { useTranslation } from 'react-i18next';

import { Inline, Stack } from '@atlaskit/primitives';
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

  return (
    <Stack space='space.075'>
      <Inline alignBlock="center">
        <label htmlFor="username-fontsize" css={[labelStyles]}>
          {t('size')}
        </label>
        <Textfield
          id="username-fontsize"
          type="number"
          min={10}
          max={50}
          width={60}
          value={fontSize}
          isCompact
          css={[buttonGroupNotFirstStyles]}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            onChange({ fontSize: parseInt(e.target.value) });
          }}
        />
      </Inline>
      <Inline>
        <label htmlFor="username-fontcolor" css={[labelStyles]}>
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
    </Stack>
  );
};

export default TextSettingsButtons;
