import React from 'react';
import { useTranslation } from 'react-i18next';

import { Stack, Inline } from '@atlaskit/primitives';

import { AnimationSettings } from '../../../models/detail/ViewSettings';
import LabeledToggle from '../../forms/LabeledToggle';
import { buttonGroupNotFirstStyles, buttonGroupNotLastStyles, labelStyles } from '../../forms/button-group-styles';
import ColorPicker from '../../forms/ColorPicker';

type AnimationSettingsButtonsProps = {
  idPrefix: string;
  settings: AnimationSettings;
  showOutline: boolean;
  onChange: (settings: AnimationSettings) => void;
};

const AnimationSettingsButtons: React.FC<AnimationSettingsButtonsProps> = ({ idPrefix, settings, showOutline, onChange }) => {
  const { t: translate, i18n } = useTranslation('translation', { keyPrefix: 'settings.overlay' });
  const t = translate as (s: string, o?: Record<string, string | boolean>) => string;
  const tt = (k: string) => {
    return t(k, { keyPrefix: '' });
  };

  const jsxJump = React.useMemo(
    () => (
      <Inline>
        <LabeledToggle
          id={`${idPrefix}-speaking-jump`}
          label={t('jump')}
          checked={settings.jump}
          onChange={(checked) => onChange({ ...settings, jump: checked })}
        />
      </Inline>
    ),
    [idPrefix, settings.jump, onChange, i18n.resolvedLanguage]
  );

  const jsxFlash = React.useMemo(
    () => (
      <Inline alignBlock="center">
        <LabeledToggle
          id={`${idPrefix}-speaking-flash`}
          label={t('flash')}
          checked={settings.flash}
          onChange={(checked) => onChange({ ...settings, flash: checked })}
          isNotLastOfGroup
        />
        <label htmlFor={`${idPrefix}-speaking-flash-color`} css={[labelStyles, buttonGroupNotFirstStyles, buttonGroupNotLastStyles]}>
          {tt('color')}
        </label>

        <ColorPicker
          id={`${idPrefix}-speaking-flash-color`}
          title={t('flash_color')}
          value={settings.flashColor}
          isNotFirstOfGroup
          onChange={(color) => onChange({ ...settings, flashColor: color })}
        />
      </Inline>
    ),
    [idPrefix, settings.flash, settings.flashColor, onChange, i18n.resolvedLanguage]
  );

  const jsxOutline = React.useMemo(() => {
    return (
      <Inline alignBlock="center">
        <LabeledToggle
          id={`${idPrefix}-speaking-outline`}
          label={t('outline')}
          checked={settings.outline}
          onChange={(checked) => onChange({ ...settings, outline: checked })}
          isNotLastOfGroup
        />
        <label htmlFor={`${idPrefix}-speaking-outline-color`} css={[labelStyles, buttonGroupNotFirstStyles, buttonGroupNotLastStyles]}>
          {tt('color')}
        </label>

        <ColorPicker
          id={`${idPrefix}-speaking-outline-color`}
          title={t('outline_color')}
          value={settings.outlineColor}
          isNotFirstOfGroup
          onChange={(color) => onChange({ ...settings, outlineColor: color })}
        />
      </Inline>
    );
  }, [idPrefix, settings.outline, settings.outlineColor, onChange, i18n.resolvedLanguage]);

  return (
    <Stack space="space.100" alignBlock="center">
      {jsxJump}
      {jsxFlash}
      {showOutline && jsxOutline}
    </Stack>
  );
};

export default AnimationSettingsButtons;
