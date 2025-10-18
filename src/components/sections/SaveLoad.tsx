import React from 'react';
import { useTranslation } from 'react-i18next';
import { css } from '@emotion/react';

import Button, { IconButton, SplitButton } from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import { Inline, Stack, Text } from '@atlaskit/primitives';
import { HelperMessage, ValidMessage, ErrorMessage, MessageWrapper } from '@atlaskit/form';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle, ModalTransition } from '@atlaskit/modal-dialog';

import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import DownloadIcon from '@atlaskit/icon/core/download';
import UploadIcon from '@atlaskit/icon/core/upload';

import FileLoader, { FileLoaderMessage } from '../../io/FileLoader';
import FileSaver from '../../io/FileSaver';
import { useAppDispatch, useAppState } from '../../models/ContextProvider';
import { appStateToJSON, initializeAppState, loadJSONString } from '../../io/AppStateIO';
import { token } from '@atlaskit/tokens';

const gridStyles = css({
  display: 'grid',
  columnGap: token('space.400'),
  rowGap: token('space.100'),
  alignContent: 'center',
  gridTemplateColumns: 'auto auto 1fr',

  '@media (max-width: 768px)': {
    gridTemplateColumns: '1fr',
  },
});

const SaveButton: React.FC = () => {
  const { t: translate } = useTranslation('translation', { keyPrefix: 'settings.saveload' });
  const t = translate as (s: string) => string;
  const fileLoader = new FileLoader();
  const fileSaver = new FileSaver();

  const state = useAppState();
  const dispatch = useAppDispatch();

  //----------------------------------------------------------------------------
  //    Load messages
  //----------------------------------------------------------------------------
  const [loaderMessage, setLoaderMessage] = React.useState<FileLoaderMessage>({ level: 'info', message: '' });

  const loaderMessageComponent = React.useMemo(() => {
    return (
      <MessageWrapper>
        {loaderMessage.level === 'info' && <HelperMessage>{loaderMessage.message}</HelperMessage>}
        {loaderMessage.level === 'success' && <ValidMessage>{loaderMessage.message}</ValidMessage>}
        {loaderMessage.level === 'danger' && <ErrorMessage>{loaderMessage.message}</ErrorMessage>}
      </MessageWrapper>
    );
  }, [loaderMessage]);

  //----------------------------------------------------------------------------
  //    Initialization
  //----------------------------------------------------------------------------
  const [isInitModalOpen, setIsInitModalOpen] = React.useState(false);
  const openInitModal = React.useCallback(() => {
    setLoaderMessage({ level: 'info', message: '' });
    setIsInitModalOpen(true);
  }, []);
  const closeInitModal = React.useCallback(() => setIsInitModalOpen(false), []);

  const initModal = (
    <ModalTransition>
      {isInitModalOpen && (
        <Modal onClose={closeInitModal}>
          <ModalHeader hasCloseButton>
            <ModalTitle>{t('initialization')}</ModalTitle>
          </ModalHeader>
          <ModalBody>{t('confirm_initialization')}</ModalBody>
          <ModalFooter>
            <Button appearance="subtle" onClick={closeInitModal}>
              {t('cancel')}
            </Button>
            <Button
              appearance="primary"
              onClick={() => {
                initializeAppState(dispatch);
                closeInitModal();
                setLoaderMessage({ level: 'success', message: t('initialized') });
              }}
            >
              {t('initialize')}
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </ModalTransition>
  );

  //----------------------------------------------------------------------------
  //    Component
  //----------------------------------------------------------------------------
  return (
    <>
      <div css={gridStyles}>
        <SplitButton>
          <Button onClick={() => fileSaver.saveTextToFile(() => appStateToJSON(state, false, true, true), 'feign-discord.json')}>
            <Inline space="space.100" alignBlock="center">
              <DownloadIcon label="" />
              {t('save_all')}
            </Inline>
          </Button>

          <DropdownMenu<HTMLButtonElement>
            shouldRenderToParent
            trigger={({ triggerRef, ...triggerProps }) => (
              <IconButton ref={triggerRef} {...triggerProps} icon={ChevronDownIcon} label="More link work item options" />
            )}
          >
            <DropdownItemGroup>
              <DropdownItem
                href="#"
                onClick={() => fileSaver.saveTextToFile(() => appStateToJSON(state, false, true, false), 'feign-discord-players.json')}
              >
                {t('save_all_but_view')}
              </DropdownItem>
              <DropdownItem
                href="#"
                onClick={() => fileSaver.saveTextToFile(() => appStateToJSON(state, true, true, false), 'feign-discord-player-ids.json')}
              >
                {t('save_all_but_view_anonymized')}
              </DropdownItem>
              <DropdownItem
                href="#"
                onClick={() => fileSaver.saveTextToFile(() => appStateToJSON(state, false, false, true), 'feign-discord-overlay.json')}
              >
                {t('save_view_only')}
              </DropdownItem>
            </DropdownItemGroup>
          </DropdownMenu>
        </SplitButton>

        <Inline space="space.100" alignBlock="center">
          <SplitButton>
            <Button
              id="load-all"
              onClick={() => fileLoader.loadTextFromFile((s) => loadJSONString(s, dispatch, true, true), setLoaderMessage, 'json')}
            >
              <Inline space="space.100" alignBlock="center">
                <UploadIcon label="" />
                {t('load_all')}
              </Inline>
            </Button>

            <DropdownMenu<HTMLButtonElement>
              shouldRenderToParent
              trigger={({ triggerRef, ...triggerProps }) => (
                <IconButton ref={triggerRef} {...triggerProps} icon={ChevronDownIcon} label="" />
              )}
            >
              <DropdownItemGroup>
                <DropdownItem
                  href="#"
                  onClick={() => fileLoader.loadTextFromFile((s) => loadJSONString(s, dispatch, true, false), setLoaderMessage, 'json')}
                >
                  {t('load_all_but_view')}
                </DropdownItem>
                <DropdownItem
                  href="#"
                  onClick={() => fileLoader.loadTextFromFile((s) => loadJSONString(s, dispatch, false, true), setLoaderMessage, 'json')}
                >
                  {t('load_view_only')}
                </DropdownItem>
                <DropdownItem href="#" onClick={openInitModal}>
                  {t('initialize_all')}
                </DropdownItem>
              </DropdownItemGroup>
            </DropdownMenu>
          </SplitButton>
          {loaderMessageComponent}
        </Inline>
      </div>
      {initModal}
    </>
  );
};

const SaveLoad: React.FC = () => {
  const { t: translate } = useTranslation('translation', { keyPrefix: 'settings.saveload' });
  const t = translate as (s: string) => string;

  return (
    <Stack space="space.100">
      <Text>{t('description')}</Text>
      <SaveButton />
    </Stack>
  );
};

export default SaveLoad;
