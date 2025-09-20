import React from 'react';
import { useTranslation } from 'react-i18next';
import invariant from 'tiny-invariant';

import Flag from '@atlaskit/flag';

import { useAppDispatch, useAppState } from '../../models/ContextProvider';
import { Inline, Stack, xcss } from '@atlaskit/primitives';
import { buildFeignImageCss } from '../../models/FeignImageCss';
import { buildCSS } from '../../models/CSSBuilder';

const Preview = () => {
  const { t: translate } = useTranslation('translation', { keyPrefix: 'preview' });
  const t = translate as (s: string, o?: Record<string, string | boolean>) => string;
  const tt = (k: string) => t(k, { keyPrefix: '' });

  const state = useAppState();
  const dispatch = useAppDispatch();

  const players = state.feignPlayers.players.get(state.feignPlayers.group);
  invariant(players !== undefined);
  const activeIDs = players.filter((id) => id !== '');
  invariant(activeIDs !== undefined);
  const activeUsers = state.discordUsers.filter((user) => activeIDs.includes(user.id));
  const isValid = activeIDs.length > 0;

  const previewUser = React.useCallback(
    (index: number) => (
      <li
        key={`preview-${index}`}
        className={`Voice_voiceState__aaaaa ${state.isSpeaking[index] ? 'wrapper_speaking' : 'self_mute'} is_widget_owner voice_state`}
        data-userid={activeUsers[index].id}
        onClick={() =>
          dispatch((prev) => {
            const newIsSpeaking = [...prev.isSpeaking.slice(0, index), !prev.isSpeaking[index], ...prev.isSpeaking.slice(index + 1)];
            return { ...prev, isSpeaking: newIsSpeaking };
          })
        }
      >
        <img
          className={`Voice_avatar__aaaaa ${state.isSpeaking[index] ? 'Voice_avatarSpeaking__aaaaa' : ''} voice_avatar`}
          src={`assets/img/discord-${index % 6}.png`}
          alt=""
        ></img>
        <div className="Voice_user_aaaaa voice_username">
          <span
            className="Voice_name__aaaaa"
            // Discord's default values.
            style={{ color: 'rgb(255,255,255)', fontSize: '14px', backgroundColor: 'rgba(30,33,36,0.95)' }}
          >
            {activeUsers[index].name}
          </span>
        </div>
      </li>
    ),
    [activeUsers, state.isSpeaking]
  );

  const paneHeight = state.viewSettings.getHeight() + 16; // add height of scroll bar

  const invalidBanner = <Flag title={tt('add_feign_player')} id="preview-no-player" />;

  const validPreview = (
    <Stack>
      <Inline xcss={xcss({ marginBlock: 'space.100' })}>{t('description')}</Inline>
      <div className="discord_preview user-select-none" style={{ overflowX: 'scroll', backgroundColor: '#cccccc', height: paneHeight }}>
        <div className="Voice_voiceContainer__aaaaa voice_container">
          <ul className="Voice_voiceStates__aaaaa voice_states">
            {Array(activeUsers.length)
              .fill(0)
              .map((_, i) => previewUser(i))}
          </ul>
        </div>
      </div>

      <style>{buildCSS(players, state.viewSettings)}</style>
      <style>{buildFeignImageCss()}</style>
    </Stack>
  );

  return isValid ? validPreview : invalidBanner;
};

export default Preview;
