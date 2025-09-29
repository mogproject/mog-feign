import React from 'react';
import { useTranslation } from 'react-i18next';
import { css } from '@emotion/react';
import invariant from 'tiny-invariant';

import { token } from '@atlaskit/tokens';
import { Box, Inline, Stack, Text, xcss } from '@atlaskit/primitives';
import Heading from '@atlaskit/heading';
import Select from '@atlaskit/select';

import { useAppDispatch, useAppState, useCustomCss, useUserGroups } from '../../models/ContextProvider';
import CopyButton from '../forms/CopyButton';
import { buildFeignImageCss } from '../../models/FeignImageCss';
import { createUrl, retrieveChannelIDs } from '../../models/detail/ChannelSettings';
import {
  buttonGroupNotFirstStyles,
  buttonGroupNotLastStyles,
  compactLabelStyles,
  iconButtonStyles,
  labelStyles,
} from '../forms/button-group-styles';
import { FEI_COLORS, NUMBER_OF_FEI_COLORS } from '../../models/app-context';

const containerStyles = xcss({
  minWidth: '220px',
  marginBlockStart: 'space.500',
  marginInlineEnd: 'space.300',

  borderRadius: '12px',
  borderWidth: '1px',
  borderColor: 'color.border.bold',
  borderStyle: 'solid',
});

const containerTitleStyles = xcss({
  backgroundColor: 'color.background.accent.blue.subtlest',

  paddingBlock: 'space.100',
  borderTopLeftRadius: '12px',
  borderTopRightRadius: '12px',

  borderBlockEndStyle: 'solid',
  borderBlockEndWidth: '1px',
  borderBlockEndColor: 'color.border',
});

const containerContentStyles = xcss({
  paddingBlock: 'space.200',
  paddingInline: 'space.200',
  backgroundColor: '#fcfcfc' as any,
  borderRadius: '0 0 12px 12px',
});

const unselectedStyles = {
  control: (base: any) => ({
    ...base,
    backgroundColor: token('color.background.accent.gray.subtler'),
    opacity: 0.8,
    marginLeft: '-1px',
    borderTopLeftRadius: '0',
    borderBottomLeftRadius: '0',
    minHeight: '24px',
    height: '24px',
  }),
  placeholder: (base: any) => ({
    ...base,
    // color: token('color.text.inverse'),
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }),
  valueContainer: (base: any) => ({
    ...base,
    paddingTop: 0,
    paddingBottom: 0,
    paddingRight: 0,
    marginRight: 0,
    marginTop: -3,
  }),
  indicatorsContainer: (base: any) => ({
    ...base,
    height: '22px',
  }),
};

const selectedStyles = {
  control: (base: any) => ({
    ...base,
    opacity: 0.9,
    marginLeft: '-1px',
    borderTopLeftRadius: '0',
    borderBottomLeftRadius: '0',
    minHeight: '24px',
    height: '24px',
  }),
  valueContainer: (base: any) => ({
    ...base,
    paddingTop: 0,
    paddingBottom: 0,
    paddingRight: 0,
    marginRight: 0,
    marginTop: -3,
  }),
  indicatorsContainer: (base: any) => ({
    ...base,
    height: '22px',
  }),
};

const fixedSizeLabelStyles = css({
  textAlign: 'center',
  width: '80px',
});

const coloredLabelStyles = [
  css({
    backgroundColor: '#ffffff',
  }),
  css({
    backgroundColor: '#ff891e',
    color: '#fcfcfc',
  }),
  css({
    backgroundColor: '#71348d',
    color: '#fcfcfc',
  }),
  css({
    backgroundColor: '#2a7b0c',
    color: '#fcfcfc',
  }),
  css({
    backgroundColor: '#4f71d7',
    color: '#fcfcfc',
  }),
  css({
    backgroundColor: '#b4000b',
    color: '#fcfcfc',
  }),
  css({
    backgroundColor: '#ffe551',
  }),
  css({
    backgroundColor: '#85ff46',
  }),
  css({
    backgroundColor: '#30d0c0',
  }),
  css({
    backgroundColor: '#ff91b6',
  }),
  css({
    backgroundColor: '#654322',
    color: '#fcfcfc',
  }),
  css({
    backgroundColor: '#ff00e0',
    color: '#fcfcfc',
  }),
  css({
    backgroundColor: '#ff4405',
    color: '#fcfcfc',
  }),
];

const groupSelectStyles = {
  control: (base: any) => ({
    ...base,
    borderRadius: `0 3px 3px 0`,
  }),
};

const QuickMenu: React.FC = () => {
  const { t: translate, i18n } = useTranslation('translation');
  const t = translate as (s: string, o?: Record<string, string | boolean>) => string;

  const state = useAppState();
  const groups = useUserGroups();
  const dispatch = useAppDispatch();

  const players = state.discordUsers.flatMap((u) =>
    state.feignPlayers.group === '' || u.groups.includes(state.feignPlayers.group) ? [{ label: u.name, value: u.id }] : []
  );

  const isValid = state.feignPlayers.players.get(state.feignPlayers.group)?.some((user) => user !== '');
  const cssContent = useCustomCss() + '\n' + buildFeignImageCss();

  const channelName = state.namedChannels.find((channel) => channel.url === state.channelURL);

  const [serverID, channelID] = retrieveChannelIDs(state.channelURL);
  const obsURL = createUrl(serverID, channelID, state.viewSettings.streamer.showStreamerFirst);

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
      inputId={'quick-feign-player-group'}
      options={groups.map((v) => ({ label: v, value: v }))}
      placeholder={t('settings.player.unselected')}
      isClearable={true}
      clearControlLabel={t('settings.player.reset')}
      noOptionsMessage={() => t('settings.player.no_groups')}
      value={state.feignPlayers.group === '' ? null : { label: state.feignPlayers.group, value: state.feignPlayers.group }}
      isDisabled={groups.length === 0}
      css={css({ width: '100%' })}
      onChange={(e: { label: string; value: string }) => {
        dispatch((prev) => ({ ...prev, feignPlayers: { ...prev.feignPlayers, group: e === null ? '' : e.value } }));
      }}
    />
  );

  const feignPlayer = (color: number) => {
    const targetId = state.feignPlayers.players.get(state.feignPlayers.group)?.[color];
    const selected = targetId === '' ? null : players.find((user) => user.value === targetId) || null;
    const inputId = `quick-feign-player-color-${color}`;

    return (
      <Inline key={inputId} alignBlock="center">
        <label htmlFor={inputId} css={[compactLabelStyles, buttonGroupNotLastStyles, fixedSizeLabelStyles, coloredLabelStyles[color]]}>
          {t(`colors.${FEI_COLORS[color]}`)}
        </label>
        <Select
          spacing="compact"
          css={[css({ width: '100%' })]}
          styles={selected ? selectedStyles : unselectedStyles}
          inputId={inputId}
          isClearable={true}
          clearControlLabel={t('reset')}
          value={selected}
          options={players}
          placeholder={''}
          noOptionsMessage={() => t('no_options')}
          onChange={(e: { label: string; value: string }) => handleUpdate(color, e === null ? '' : e.value)}
        />
      </Inline>
    );
  };

  return (
    <Stack xcss={containerStyles}>
      <Inline alignInline="center" xcss={containerTitleStyles}>
        <Heading size="small">{t('quick.quick_menu')}</Heading>
      </Inline>

      <Stack space="space.300" xcss={containerContentStyles}>
        <Stack space="space.100">
          <Text size="medium" weight="bold">
            {t('obs.obs_settings')}
          </Text>

          <Box space="space.025">
            <Inline alignBlock="center">
              <label htmlFor="quick-url-copy" css={[labelStyles, buttonGroupNotLastStyles]}>
                {'URL'}
              </label>

              <CopyButton
                id="quick-url-copy"
                content={obsURL}
                disabled={channelID === ''}
                style={css([iconButtonStyles, buttonGroupNotFirstStyles])}
              />
            </Inline>
            <Box xcss={xcss({ overflowY: 'clip', textOverflow: 'ellipsis', width: '240px' })}>
              <Text size="small" color="color.text.subtlest">
                {channelName?.name || ''}
              </Text>
            </Box>
          </Box>

          <Inline alignBlock="center">
            <label htmlFor="quick-css-copy" css={[labelStyles, buttonGroupNotLastStyles]}>
              {t('obs.custom_css')}
            </label>

            <CopyButton
              id="quick-css-copy"
              content={cssContent}
              disabled={!isValid}
              style={css([iconButtonStyles, buttonGroupNotFirstStyles])}
            />
          </Inline>
        </Stack>

        <Stack space="space.100">
          <Text size="medium" weight="bold">
            {t('settings.feign_player_settings')}
          </Text>
          <Inline alignBlock="center">
            <span css={[labelStyles]}>{t('group')}</span>
            {groupSelection}
          </Inline>

          <Stack space="space.050">
            {Array(13)
              .fill(0)
              .map((_, i) => feignPlayer(i))}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default QuickMenu;
