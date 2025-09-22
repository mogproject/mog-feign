import React from 'react';
import { css } from '@emotion/react';

import { Inline, Stack, Text, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

const cardStyles = xcss({
  borderRadius: '12px',
  borderColor: 'color.border.bold',
  borderWidth: '1px',
  borderStyle: 'solid',
  paddingInline: 'space.100',
  paddingBottom: 'space.100',
});

const cardHeaderStyles = xcss({
  marginInline: 'space.negative.100',
  backgroundColor: 'color.background.neutral',
  borderColor: 'color.border',
  borderWidth: '0px',
  borderStyle: 'solid',
  borderBottomWidth: '1px',
  borderTopLeftRadius: '12px',
  borderTopRightRadius: '12px',
});

const cardContentGridStyles = css({
  display: 'grid',
  rowGap: token('space.200'),
  columnGap: token('space.050'),
  gridTemplateColumns: 'auto 1fr',
});

type SettingsCardProps = {
  children: React.ReactNode;
  title: string;
};

const SettingsCard: React.FC<SettingsCardProps> = ({ children, title }) => {
  return (
    <Stack space="space.100" xcss={cardStyles}>
      <Inline alignInline="center" xcss={cardHeaderStyles}>
        <Text size="large">{title}</Text>
      </Inline>
      <div css={cardContentGridStyles}>{children}</div>
    </Stack>
  );
};

export default SettingsCard;
