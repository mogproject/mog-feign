import React from 'react';

import { APP_VERSION } from '../../models/app-context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube, faGithub } from '@fortawesome/free-brands-svg-icons';
import { useTranslation } from 'react-i18next';
import { Box, Inline, Text, xcss } from '@atlaskit/primitives';
import { LinkButton } from '@atlaskit/button/new';
import Select, { OptionType } from '@atlaskit/select';
import invariant from 'tiny-invariant';
import { SingleValue } from '@atlaskit/react-select';
import SideNavToggleButton from '../layout/SideNavToggleButton';
import { Hide } from '@atlaskit/primitives/responsive';

const topBarStyles = xcss({
  height: '100%',
  paddingLeft: 'space.200',

  backgroundColor: 'color.background.brand.subtlest',
  borderBlockEndColor: 'color.border.bold',
  borderBlockEndStyle: 'solid',
  borderBlockEndWidth: 'border.width',
});

const compactSelectStyles = {
  control: (base: any) => ({
    ...base,
    minHeight: '28px',
  }),
  valueContainer: (base: any) => ({
    ...base,
    paddingTop: 0,
    paddingBottom: 0,
    paddingRight: 0,
    marginRight: 0,
  }),
  indicatorsContainer: (base: any) => ({
    ...base,
    height: '30px',
  }),
};

const Header: React.FC = () => {
  const { t: translate, i18n } = useTranslation();
  const t = translate as (s: string) => string;
  const options = [
    { value: 'ja', label: '日本語' },
    { value: 'en', label: 'English' },
  ];
  invariant(i18n.resolvedLanguage !== undefined);
  const selected = options.find((opt) => opt.value === i18n.resolvedLanguage);
  invariant(selected !== undefined);

  // @note Somehow, TopNavEnd does not work as expected.
  return (
    <Inline xcss={topBarStyles} spread={'space-between'} alignBlock={'center'}>
      <Inline alignBlock="center">
        <SideNavToggleButton collapseLabel={t('layout.collapse_sidebar')} expandLabel={t('layout.expand_sidebar')} />

        <Inline space="space.050" alignBlock="center">
          <LinkButton appearance="subtle" href="#" shouldFitContainer={false}>
            <Text weight="bold" color="color.text">
              Feign CSS Generator
            </Text>
          </LinkButton>
          <Hide below="sm">
            <Text weight="regular" color="color.text.subtlest">
              {t('app_title')}
            </Text>
          </Hide>
        </Inline>
      </Inline>

      <Inline space="space.100" alignBlock="center" xcss={xcss({ paddingRight: 'space.200' })}>
        <Text size="small" color="color.text.subtlest">
          v{APP_VERSION}
        </Text>
        <Select
          styles={compactSelectStyles}
          inputId="language-select"
          testId="react-language-select"
          onChange={(v: SingleValue<OptionType> | null) => {
            invariant(v && typeof v.value === 'string');
            i18n.changeLanguage(v.value);
          }}
          appearance="subtle"
          value={selected}
          options={options}
        />

        <Box>
          <a href="https://www.youtube.com/@mogproject" target="_blank" rel="noreferrer">
            <FontAwesomeIcon icon={faYoutube} color="black" size="2x" />
          </a>
        </Box>

        <Box>
          <a href="https://github.com/mogproject/mog-feign/" target="_blank" rel="noreferrer">
            <FontAwesomeIcon icon={faGithub} color="black" size="2x" />
          </a>
        </Box>
      </Inline>
    </Inline>
  );
};

export default Header;
