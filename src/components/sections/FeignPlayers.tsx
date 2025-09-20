import React from 'react';
import { useTranslation } from 'react-i18next';
import invariant from 'tiny-invariant';

import { Inline, Stack, Text, xcss } from '@atlaskit/primitives';
import { css } from '@emotion/react';
import { useAppDispatch, useAppState, useUserGroups } from '../../models/ContextProvider';
import { FEI_COLORS, NUMBER_OF_FEI_COLORS } from '../../models/app-context';
import Image from '@atlaskit/image';
import Select from '@atlaskit/select';
import { token } from '@atlaskit/tokens';

const gridStyles = css({
  display: 'grid',
  gap: 'space.200',
  // default: 7 columns
  gridTemplateColumns: 'repeat(7, 1fr)',

  // small screen: 5 columns
  '@media (max-width: 1024px)': {
    gridTemplateColumns: 'repeat(5, 1fr)',
  },
});

const playerStyles = xcss({
  height: '156px',
  paddingInline: 'space.050',
});

const unselectedStyles = {
  control: (base: any) => ({
    ...base,
    backgroundColor: token('color.background.accent.gray.bolder'),
    opacity: 0.8,
  }),
  placeholder: (base: any) => ({
    ...base,
    color: token('color.text.inverse'),
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }),
};

const selectedStyles = {
  control: (base: any) => ({
    ...base,
    opacity: 0.9,
  }),
};

const labelStyles = css({
  padding: '5px 8px',
  backgroundColor: token('color.background.input.hovered'),
  borderRadius: '3px 0 0 3px',
  borderWidth: '1px',
  borderColor: token('color.border.accent.gray'),
  borderStyle: 'solid',
  borderRight: 'none',
});

const groupSelectStyles = {
  control: (base: any) => ({
    ...base,
    borderRadius: `0 3px 3px 0`,
    minWidth: '240px',
  }),
};

const FeignPlayers: React.FC = () => {
  const { t: translate } = useTranslation('translation', { keyPrefix: 'settings.player' });
  const t = translate as (s: string, o?: Record<string, string | boolean>) => string;
  const tt = (k: string, o?: Record<string, string | boolean>) => {
    return t(k, { ...o, keyPrefix: '' });
  };

  const state = useAppState();
  const groups = useUserGroups();
  const dispatch = useAppDispatch();

  const players = state.discordUsers.flatMap((u) =>
    state.feignPlayers.group === '' || u.groups.includes(state.feignPlayers.group) ? [{ label: u.name, value: u.id }] : []
  );

  function handleUpdate(color: number, newId: string) {
    dispatch((prev) => {
      const current = prev.feignPlayers.players.get(prev.feignPlayers.group);
      invariant(current !== undefined && current.length === NUMBER_OF_FEI_COLORS);

      const next = current.map((id, i) => {
        if (i === color) return newId; // data to update
        if (id === newId) return ''; // ID already exists for another color
        return id;
      });
      const newPlayers = prev.feignPlayers.players.set(prev.feignPlayers.group, next);
      return { ...prev, feignPlayers: { group: prev.feignPlayers.group, players: newPlayers } };
    });
  }

  const groupSelection = (
    <Select
      spacing="compact"
      styles={groupSelectStyles}
      inputId={`feign-player-group`}
      options={groups.map((v) => ({ label: v, value: v }))}
      placeholder={t('unselected')}
      isClearable={true}
      clearControlLabel={t('reset')}
      noOptionsMessage={() => t('no_groups')}
      value={state.feignPlayers.group === '' ? null : { label: state.feignPlayers.group, value: state.feignPlayers.group }}
      onChange={(e: { label: string; value: string }) => {
        dispatch((prev) => ({ ...prev, feignPlayers: { ...prev.feignPlayers, group: e === null ? '' : e.value } }));
      }}
    />
  );

  const FeignPlayer = (color: number) => {
    const targetId = state.feignPlayers.players.get(state.feignPlayers.group)?.[color];
    const selected = targetId === '' ? null : players.find((user) => user.value === targetId) || null;

    return (
      <Stack key={`player-${color}`} alignInline="center" xcss={playerStyles}>
        <Text>{tt(`colors.${FEI_COLORS[color]}`)}</Text>
        <Image src={`assets/img/${FEI_COLORS[color]}-small.png`} width={'80px'} alt={t(FEI_COLORS[color])} />
        <Select
          spacing="compact"
          css={css({ marginTop: '-56px', width: '100%' })}
          styles={selected ? selectedStyles : unselectedStyles}
          inputId={`feign-player-color-${color}`}
          isClearable={true}
          clearControlLabel={t('reset')}
          value={selected}
          options={players}
          placeholder={''}
          noOptionsMessage={() => t('no_options')}
          onChange={(e: { label: string; value: string }) => handleUpdate(color, e === null ? '' : e.value)}
        />
      </Stack>
    );
  };

  return (
    <Stack>
      <Inline alignBlock="center" xcss={xcss({ marginBlock: 'space.200' })}>
        <span css={[labelStyles]}>{t('filter_by_group')}</span>
        {groupSelection}
      </Inline>
      <div css={gridStyles}>
        {Array(13)
          .fill(0)
          .map((_, i) => FeignPlayer(i))}
      </div>
    </Stack>
  );
};

export default FeignPlayers;
