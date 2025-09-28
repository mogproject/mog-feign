import React from 'react';
import { useTranslation } from 'react-i18next';

import { Inline, Stack, Text, xcss } from '@atlaskit/primitives';
import { css } from '@emotion/react';
import Button from '@atlaskit/button/new';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle, ModalTransition } from '@atlaskit/modal-dialog';
import Toggle from '@atlaskit/toggle';

import { useAppDispatch, useAppState } from '../../models/ContextProvider';
import {
  AvatarSettings,
  AvatarShape,
  defaultViewSettings,
  FeiSettings,
  StreamerSettings,
  UsernameSettings,
  ViewSettings,
} from '../../models/detail/ViewSettings';
import { Label } from '@atlaskit/form';
import RadioButtonGroup from '../forms/RadioButtonGroup';
import AnimationSettingsButtons from './detail/AnimationSettingsButtons';
import { token } from '@atlaskit/tokens';
import SettingsCard from './detail/SettingsCard';
import { toggleLabelStyles } from '../forms/LabeledToggle';
import TextSettingsButtons from './detail/TextSettingsButtons';
import CompactRange from '../forms/CompactRange';

const gridStyles = css({
  display: 'grid',
  gap: token('space.200'),
  // default: 3 columns
  gridTemplateColumns: 'auto auto auto 1fr',
});

const ViewSettingsPane: React.FC = () => {
  const { t: translate } = useTranslation('translation', { keyPrefix: 'settings.overlay' });
  const t = translate as (s: string, o?: Record<string, string | boolean>) => string;
  const tt = (k: string) => t(k, { keyPrefix: '' });

  const state = useAppState();
  const dispatch = useAppDispatch();

  //----------------------------------------------------------------------------
  //    Updaters
  //----------------------------------------------------------------------------
  const updateFeiSettings = React.useCallback(
    (options: Partial<FeiSettings>) => {
      dispatch((prev) => ({
        ...prev,
        viewSettings: new ViewSettings(
          { ...prev.viewSettings.fei, ...options },
          prev.viewSettings.avatar,
          prev.viewSettings.username,
          prev.viewSettings.streamer
        ),
      }));
    },
    [dispatch]
  );
  const updateAvatarSettings = React.useCallback(
    (options: Partial<AvatarSettings>) => {
      dispatch((prev) => ({
        ...prev,
        viewSettings: new ViewSettings(
          prev.viewSettings.fei,
          { ...prev.viewSettings.avatar, ...options },
          prev.viewSettings.username,
          prev.viewSettings.streamer
        ),
      }));
    },
    [dispatch]
  );
  const updateUsernameSettings = React.useCallback(
    (options: Partial<UsernameSettings>) => {
      dispatch((prev) => ({
        ...prev,
        viewSettings: new ViewSettings(
          prev.viewSettings.fei,
          prev.viewSettings.avatar,
          { ...prev.viewSettings.username, ...options },
          prev.viewSettings.streamer
        ),
      }));
    },
    [dispatch]
  );
  const updateStreamerSettings = React.useCallback(
    (options: Partial<StreamerSettings>) => {
      dispatch((prev) => ({
        ...prev,
        viewSettings: new ViewSettings(prev.viewSettings.fei, prev.viewSettings.avatar, prev.viewSettings.username, {
          ...prev.viewSettings.streamer,
          ...options,
        }),
      }));
    },
    [dispatch]
  );

  //----------------------------------------------------------------------------
  //    Initialization
  //----------------------------------------------------------------------------
  const [isInitModalOpen, setIsInitModalOpen] = React.useState(false);
  const openInitModal = React.useCallback(() => setIsInitModalOpen(true), []);
  const closeInitModal = React.useCallback(() => setIsInitModalOpen(false), []);

  const initModal = (
    <ModalTransition>
      {isInitModalOpen && (
        <Modal onClose={closeInitModal}>
          <ModalHeader hasCloseButton>
            <ModalTitle>{t('initialization')}</ModalTitle>
          </ModalHeader>
          <ModalBody>{t('initialization_description')}</ModalBody>
          <ModalFooter>
            <Button appearance="subtle" onClick={closeInitModal}>
              {tt('cancel')}
            </Button>
            <Button
              appearance="primary"
              onClick={() => {
                dispatch((prev) => ({ ...prev, viewSettings: defaultViewSettings }));
                closeInitModal();
              }}
            >
              {t('initialize')}
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </ModalTransition>
  );

  return (
    <>
      {initModal}
      <Stack space="space.100">
        <Inline>
          <Button appearance="default" onClick={() => openInitModal()}>
            {t('initialize')}
          </Button>
        </Inline>
        {/*
--------------------------------------------------------------------------------
         */}
        <Inline alignBlock="center">
          <div css={[toggleLabelStyles]}>
            <Label htmlFor="show-my-avatar-first">{t('show_my_avatar_first')}</Label>
          </div>
          <Toggle
            id="show-my-avatar-first"
            size="regular"
            isChecked={state.viewSettings.streamer.showStreamerFirst}
            onChange={() => updateStreamerSettings({ showStreamerFirst: !state.viewSettings.streamer.showStreamerFirst })}
          />
        </Inline>
        {/*
--------------------------------------------------------------------------------
         */}
        <div css={gridStyles}>
          <SettingsCard title={t('feign_characters')}>
            <div css={css({ textAlign: 'end', alignContent: 'center' })}>
              <Text size="small" weight="bold">
                {t('facing')}
              </Text>
            </div>
            <RadioButtonGroup
              id="fei-facing"
              labels={[t('facing_left'), t('facing_right')]}
              checked={state.viewSettings.fei.mirror ? 0 : 1}
              onChange={(index) => updateFeiSettings({ mirror: index === 0 })}
            />

            <div css={css({ textAlign: 'end', alignContent: 'center' })}>
              <Label htmlFor="fei-interval">{t('interval')}</Label>
            </div>
            <CompactRange
              id="fei-interval"
              min={0}
              max={50}
              value={state.viewSettings.fei.interval}
              onChange={(x) => {
                updateFeiSettings({ interval: x });
              }}
            />

            <div css={css({ marginTop: '4px', textAlign: 'end' })}>
              <Text size="small" weight="bold" align="end">
                {t('speaking_behavior')}
              </Text>
            </div>
            <AnimationSettingsButtons
              idPrefix="fei"
              settings={state.viewSettings.fei.speaking}
              showOutline={false}
              onChange={(settings) => updateFeiSettings({ speaking: settings })}
            />
          </SettingsCard>
          {/*
--------------------------------------------------------------------------------
         */}
          <SettingsCard title={t('discord_avatar')}>
            <div css={[toggleLabelStyles, css({ textAlign: 'end' })]}>
              <Label htmlFor="show-avatar">{tt('show')}</Label>
            </div>
            <Toggle
              id="show-avatar"
              size="regular"
              isChecked={state.viewSettings.avatar.show}
              onChange={() => updateAvatarSettings({ show: !state.viewSettings.avatar.show })}
            />

            <div css={css({ textAlign: 'end', alignContent: 'center' })}>
              <Label htmlFor="avatar-offset">{t('vertical_offset')}</Label>
            </div>
            <CompactRange
              id="avatar-offset"
              min={-300}
              max={300}
              value={state.viewSettings.avatar.offsetY}
              onChange={(value) => {
                updateAvatarSettings({ offsetY: value });
              }}
            />

            <div css={[toggleLabelStyles, css({ textAlign: 'end' })]}>
              <Label htmlFor="show-avatar-front">{t('show_front')}</Label>
            </div>
            <Toggle
              id="show-avatar-front"
              size="regular"
              isChecked={state.viewSettings.avatar.front}
              onChange={() => updateAvatarSettings({ front: !state.viewSettings.avatar.front })}
            />

            <div css={css({ textAlign: 'end', alignContent: 'center' })}>
              <Text size="small" weight="bold">
                {t('shape')}
              </Text>
            </div>
            <RadioButtonGroup
              id="avatar-shape"
              labels={[t('circle'), t('rounded_rectangle'), t('rectangle')]}
              checked={state.viewSettings.avatar.shape.valueOf()}
              onChange={(index) =>
                updateAvatarSettings({ shape: [AvatarShape.Circle, AvatarShape.RoundedRectangle, AvatarShape.Rectangle][index] })
              }
            />

            <div css={css({ marginTop: '4px', textAlign: 'end' })}>
              <Text size="small" weight="bold" align="end">
                {t('speaking_behavior')}
              </Text>
            </div>
            <AnimationSettingsButtons
              idPrefix="avatar"
              settings={state.viewSettings.avatar.speaking}
              showOutline={true}
              onChange={(settings) => updateAvatarSettings({ speaking: settings })}
            />
          </SettingsCard>
          {/*
--------------------------------------------------------------------------------
         */}
          <SettingsCard title={t('username')}>
            <div css={[toggleLabelStyles, css({ textAlign: 'end' })]}>
              <Label htmlFor="show-username">{tt('show')}</Label>
            </div>
            <Toggle
              id="show-username"
              size="regular"
              isChecked={state.viewSettings.username.show}
              onChange={() => updateUsernameSettings({ show: !state.viewSettings.username.show })}
            />

            <div css={css({ textAlign: 'end', alignContent: 'center' })}>
              <Label htmlFor="username-offset">{t('vertical_offset')}</Label>
            </div>
            <CompactRange
              id="username-offset"
              min={-300}
              max={300}
              value={state.viewSettings.username.offsetY}
              onChange={(value) => {
                updateUsernameSettings({ offsetY: value });
              }}
            />
            <div css={css({ textAlign: 'end', alignContent: 'center' })}>
              <Text size="small" weight="bold">
                {t('font')}
              </Text>
            </div>
            <TextSettingsButtons
              fontSize={state.viewSettings.username.fontSize}
              fontColor={state.viewSettings.username.fontColor}
              backgroundColor={state.viewSettings.username.backgroundColor}
              onChange={updateUsernameSettings}
            />
          </SettingsCard>
        </div>
      </Stack>
    </>
  );
};

export default ViewSettingsPane;
