import React from 'react';
import { useTranslation } from 'react-i18next';
import invariant from 'tiny-invariant';

import { Box, Inline, Stack, Text, xcss } from '@atlaskit/primitives';
import { css } from '@emotion/react';
import Button from '@atlaskit/button/new';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle, ModalTransition } from '@atlaskit/modal-dialog';
import Toggle from '@atlaskit/toggle';
import Textfield from '@atlaskit/textfield';

import { useAppDispatch, useAppState } from '../../models/ContextProvider';
import {
  AvatarSettings,
  defaultViewSettings,
  FeiSettings,
  StreamerSettings,
  UsernameSettings,
  ViewSettings,
} from '../../models/detail/ViewSettings';
import { Label } from '@atlaskit/form';
import RadioButtonGroup from '../forms/RadioButtonGroup';

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
          <div css={css({ marginTop: '2px' })}>
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
        <Box>
          <Inline>{t('feign_characters')}</Inline>
          <Stack space="space.200">
            <Inline alignBlock="center" spread="space-between">
              <Inline alignBlock="center" space="space.100">
                <Text size="small">{t('facing')}</Text>
                <RadioButtonGroup
                  id="fei-facing"
                  labels={[t('facing_left'), t('facing_right')]}
                  checked={state.viewSettings.fei.mirror ? 0 : 1}
                  onChange={(index) => updateFeiSettings({ mirror: index === 0 })}
                />
              </Inline>
              <Inline alignBlock="center" space="space.100">
                <span css={css({ width: '40px' })}>
                  <Label htmlFor="fei-interval">{t('interval')}</Label>
                </span>
                <Textfield
                  id="fei-interval"
                  type="number"
                  min={0}
                  max={50}
                  width={80}
                  value={state.viewSettings.fei.interval}
                  isCompact
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    updateFeiSettings({ interval: parseInt(e.target.value) });
                  }}
                />
              </Inline>
            </Inline>
            <Inline space="space.100">
              <Text size="small">{t('speaking_behavior')}</Text>
            </Inline>
          </Stack>
        </Box>
      </Stack>
      {initModal}
    </>
  );
};

export default ViewSettingsPane;
