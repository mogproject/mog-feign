import React from 'react';
import { useTranslation } from 'react-i18next';
import { css } from '@emotion/react';
import invariant from 'tiny-invariant';

import { token } from '@atlaskit/tokens';
import { Inline, Stack, Text, xcss } from '@atlaskit/primitives';
import Flag from '@atlaskit/flag';
import Image from '@atlaskit/image';
import Textfield from '@atlaskit/textfield';

import DownloadIcon from '@atlaskit/icon/core/download';

import { useAppState } from '../../models/ContextProvider';
import CopyButton from '../forms/CopyButton';
import FileSaver from '../../io/FileSaver';
import { buildCSS } from '../../models/CSSBuilder';
import { buildFeignImageCss } from '../../models/FeignImageCss';
import { retrieveChannelIDs } from '../../models/detail/ChannelSettings';
import { buttonGroupNotFirstStyles, buttonGroupNotLastStyles, iconButtonStyles, labelStyles } from '../forms/button-group-styles';

const textFieldStyles = css({
  marginLeft: '-1px',
  borderRadius: '0px !important',

  '& > [data-ds--text-field--input]': {
    fontSize: 13,
  },
});

function createUrl(serverId: string, channelId: string, showStreamerFirst: boolean) {
  let url = new URL(`https://streamkit.discord.com/overlay/voice/${serverId}/${channelId}`);
  if (showStreamerFirst) url.searchParams.append('streamer_avatar_first', 'true');
  return url.toString();
}

const OBSSettings: React.FC = () => {
  const { t: translate, i18n } = useTranslation('translation', { keyPrefix: 'obs' });
  const t = translate as (s: string, o?: Record<string, string | boolean>) => string;
  const tt = (k: string, o?: Record<string, string | boolean>) => t(k, { ...o, keyPrefix: '' });

  const state = useAppState();
  const isValid = state.feignPlayers.players.get(state.feignPlayers.group)?.some((user) => user !== '');

  const players = state.feignPlayers.players.get(state.feignPlayers.group);
  invariant(players !== undefined);
  const cssContent = buildCSS(players, state.viewSettings) + '\n' + buildFeignImageCss();

  const [serverID, channelID] = retrieveChannelIDs(state.channelURL);
  const obsURL = createUrl(serverID, channelID, state.viewSettings.streamer.showStreamerFirst);
  const obsWidth = 1772 + state.viewSettings.fei.interval * 12; // should support up to 13 users
  const obsHeight = state.viewSettings.getHeight();

  const fileSaver = new FileSaver();

  const invalidBanner = <Flag title={tt('add_feign_player')} id="obs-no-player" />;

  const validView = (
    <Stack space="space.100">
      <Inline>{t('description')}</Inline>
      <div css={{ display: 'grid', columnGap: token('space.200'), gridTemplateColumns: '2fr 3fr' }}>
        <Image width="100%" src="assets/img/obs.png" alt="obs" />
        <Stack space="space.400">
          {/*
--------------------------------------------------------------------------------
    URL
--------------------------------------------------------------------------------*/}
          <Inline alignBlock="center">
            <label htmlFor="obs-url" css={[labelStyles, buttonGroupNotLastStyles]}>
              {'URL'}
            </label>

            <Textfield
              id="obs-url"
              isCompact
              css={textFieldStyles}
              value={channelID === '' ? t('invalid_channel_url') : obsURL}
              isReadOnly
            />

            <CopyButton content={obsURL} disabled={channelID === ''} style={css([iconButtonStyles, buttonGroupNotFirstStyles])} />
          </Inline>
          <Stack space="space.100">
            <Inline spread="space-between" space="space.400">
              {/*
--------------------------------------------------------------------------------
    Width
--------------------------------------------------------------------------------*/}
              <Inline alignBlock="center" xcss={xcss({ width: '100%' })}>
                <label htmlFor="obs-width" css={[labelStyles, buttonGroupNotLastStyles]}>
                  {t('width')}
                </label>

                <Textfield id="obs-width" isCompact css={textFieldStyles} value={obsWidth} isReadOnly />

                <CopyButton content={obsWidth.toString()} style={css([iconButtonStyles, buttonGroupNotFirstStyles])} />
              </Inline>
              {/*
--------------------------------------------------------------------------------
    Height
--------------------------------------------------------------------------------*/}
              <Inline alignBlock="center" xcss={xcss({ width: '100%' })}>
                <label htmlFor="obs-height" css={[labelStyles, buttonGroupNotLastStyles]}>
                  {t('height')}
                </label>

                <Textfield id="obs-height" isCompact css={textFieldStyles} value={obsHeight} isReadOnly />

                <CopyButton content={obsHeight.toString()} style={css([iconButtonStyles, buttonGroupNotFirstStyles])} />
              </Inline>
            </Inline>

            <Text size="small">{t('size_notes')}</Text>
          </Stack>
          {/*
--------------------------------------------------------------------------------
    Custom CSS
--------------------------------------------------------------------------------*/}
          <Inline alignBlock="center">
            <span css={[labelStyles, buttonGroupNotLastStyles, css({ paddingBlock: '7px' })]}>{t('custom_css')}</span>

            <CopyButton
              content={cssContent}
              style={css([iconButtonStyles, buttonGroupNotFirstStyles, buttonGroupNotLastStyles])}
              label={t('copy_to_clipboard')}
            />

            <button
              css={[iconButtonStyles, buttonGroupNotFirstStyles]}
              onClick={() => fileSaver.saveTextToFile(() => cssContent, 'feign.css')}
            >
              <Inline space="space.100" alignBlock="center">
                <DownloadIcon label="" />
                {t('save_as_file')}
              </Inline>
            </button>
          </Inline>
        </Stack>
      </div>
    </Stack>
  );

  return isValid ? validView : invalidBanner;
};

export default OBSSettings;
