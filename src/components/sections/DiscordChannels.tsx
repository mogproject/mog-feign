import React from 'react';
import { css } from '@emotion/react';
import { useTranslation } from 'react-i18next';

// Atlassian Design System
import { Box, Inline, Stack, Text, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';
import Form, { ErrorMessage, Field, MessageWrapper } from '@atlaskit/form';
import Button, { IconButton } from '@atlaskit/button/new';
import TextField from '@atlaskit/textfield';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle, ModalTransition } from '@atlaskit/modal-dialog';
import { reorder } from '@atlaskit/pragmatic-drag-and-drop/reorder';

// Icons
import ArrowDownIcon from '@atlaskit/icon/core/arrow-down';
import DeleteIcon from '@atlaskit/icon/core/delete';
import RadioUncheckedIcon from '@atlaskit/icon/core/radio-unchecked';
import RadioCheckedIcon from '@atlaskit/icon/core/radio-checked';

import LabeledTextField from '../forms/LabeledTextField';
import { useAppDispatch, useAppState } from '../../models/ContextProvider';
import { isValidVoiceChannelURL, NamedChannel } from '../../models/detail/ChannelSettings';
import { HeadType, RowType } from '../forms/rankable-table/types';
import EditableText from '../forms/EditableText';
import RankableTable from '../forms/rankable-table/RankableTable';

const compactTextFieldStyles = css({
  height: '32px',
  paddingBlock: 'space.0',
  paddingInline: 'space.050',
});

const readViewContainerStyles = xcss({
  display: 'flex',
  font: token('font.body'),
  maxWidth: '100%',
  marginBlock: 'space.050',
  paddingBlock: 'space.0',
  paddingInline: 'space.075',
  wordBreak: 'break-word',
  overflowX: 'hidden',
});

const readViewReadonlyStyles = xcss({
  paddingLeft: '0',
  color: 'color.text.subtlest',
});

const newEntryStyles = xcss({
  paddingTop: 'space.025',
  height: '60px',
});

const tableStyles = xcss({
  marginTop: 'space.0',
  height: '198px',
});

const DiscordChannels: React.FC = () => {
  const { t: translate } = useTranslation('translation', { keyPrefix: 'settings.channel' });
  const t = translate as (s: string, o?: Record<string, string | boolean>) => string;
  const tt = (k: string, o?: Record<string, string | boolean>) => {
    return t(k, { ...o, keyPrefix: '' });
  };

  const { channelURL, namedChannels, namedChannelsTableSettings } = useAppState();
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [removeIndex, setRemoveIndex] = React.useState(-1);
  const openModal = React.useCallback(() => setIsModalOpen(true), []);
  const closeModal = React.useCallback(() => setIsModalOpen(false), []);

  // Utility functions.
  const setEditValue = (index: number, key: string, value: string) => {
    dispatch((prev) => {
      const newChannles = prev.namedChannels.map((channel: NamedChannel, i: number) =>
        i == index ? { ...channel, [key]: value } : channel
      );
      return { ...prev, namedChannels: newChannles };
    });
  };

  const removeNamedChannel = () => {
    if (removeIndex < 0) return;

    const newNamedChannels = namedChannels.filter((_, index) => index !== removeIndex);
    setRemoveIndex(-1);
    dispatch((prev) => ({ ...prev, namedChannels: newNamedChannels }));
  };

  // Validations.
  const validateName = (editName: string, index: number) => {
    if (editName === '') {
      return undefined;
    } else if (namedChannels.some((x, i) => i !== index && x.name === editName)) {
      return t('already_exists');
    } else {
      return undefined;
    }
  };

  const canRegister = isValidVoiceChannelURL(channelURL) && !namedChannels.some((x, _) => x.url === channelURL);

  // Named channels
  type FormValues = {
    name: string;
  };

  const newEntryField = (
    <Form<FormValues>
      key="named-channel-new"
      onSubmit={(data, form) => {
        const name = data.name.trim();

        dispatch((prev) => {
          const newNamedChannel = {
            name: name,
            url: prev.channelURL,
            createdAt: Date.now(),
          };
          return { ...prev, namedChannels: [...prev.namedChannels, newNamedChannel] };
        });

        form.reset(); // clear all fields
      }}
    >
      {({ formProps }) => (
        <form {...formProps}>
          <Inline space="space.200" alignInline="center" alignBlock="start" shouldWrap xcss={newEntryStyles}>
            <Inline space="space.100" alignBlock="center" xcss={xcss({ paddingTop: 'space.075' })}>
              <ArrowDownIcon label="" />
              <Text weight={'semibold'} color={'color.text'}>
                {t('register')}
              </Text>
            </Inline>
            {/* name */}
            <Field<string> name="name" isRequired defaultValue="" validate={(s) => validateName((s || '').trim(), -1)}>
              {({ fieldProps, error }) => (
                <Box xcss={xcss({ width: '180px', marginTop: 'space.negative.100' })}>
                  <TextField {...fieldProps} css={compactTextFieldStyles} placeholder={t('register_placeholder')} autoComplete='off' />
                  <MessageWrapper>{error && <ErrorMessage>{error}</ErrorMessage>}</MessageWrapper>
                </Box>
              )}
            </Field>

            {/* add button */}
            <Box xcss={xcss({ marginTop: 'space.0' })}>
              <Button type="submit" appearance="primary" spacing="default" isDisabled={!canRegister}>
                {tt('add')}
              </Button>
            </Box>
          </Inline>
        </form>
      )}
    </Form>
  );

  // Create table.
  const head: HeadType = {
    cells: [
      { key: 'name', content: <Box xcss={xcss({ paddingLeft: 'space.100' })}>{tt('name')}</Box>, isSortable: true },
      { key: 'url', content: <span>URL</span>, isSortable: true },
      { key: 'createdAt', content: t('created_at'), isSortable: true },
      { key: 'select', content: t('select'), isSortable: false },
      { key: 'select', content: tt('remove'), isSortable: false },
    ],
  };
  const rows: RowType[] = namedChannels.map((channel, index) => ({
    cells: [
      //------------------------------------------------------------------------
      //    Name
      //------------------------------------------------------------------------
      {
        key: channel.name,
        content: (
          <EditableText
            defaultValue={channel.name}
            readView={() => <Box xcss={readViewContainerStyles}>{channel.name}</Box>}
            validate={(name) => validateName(name, index)}
            onConfirm={(value) => setEditValue(index, 'name', value)}
            keyPrefix={`table-name-${index}`}
          />
        ),
      },
      //------------------------------------------------------------------------
      //    URL
      //------------------------------------------------------------------------
      {
        key: channel.url,
        content: (
          <Inline alignBlock="center" xcss={[readViewContainerStyles, readViewReadonlyStyles]}>
            {channel.url}
          </Inline>
        ),
      },
      //------------------------------------------------------------------------
      //    Created at
      //------------------------------------------------------------------------
      {
        key: channel.createdAt,
        content: (
          <Inline alignBlock="center" xcss={[readViewContainerStyles, readViewReadonlyStyles]}>
            {new Date(channel.createdAt).toLocaleString()}
          </Inline>
        ),
      },
      //------------------------------------------------------------------------
      //    Select
      //------------------------------------------------------------------------
      {
        content: (
          <IconButton
            icon={channelURL === channel.url ? RadioCheckedIcon : RadioUncheckedIcon}
            label={t('select')}
            appearance="subtle"
            spacing="compact"
            isTooltipDisabled={true}
            onClick={() => {
              if (channelURL !== channel.url) {
                dispatch((prev) => ({ ...prev, channelURL: channel.url }));
              }
            }}
          />
        ),
      },
      //------------------------------------------------------------------------
      //    Remove
      //------------------------------------------------------------------------
      {
        content: (
          <IconButton
            icon={DeleteIcon}
            label={tt('remove')}
            appearance="subtle"
            spacing="compact"
            isTooltipDisabled={true}
            onClick={() => {
              setRemoveIndex(index);
              openModal();
            }}
          />
        ),
      },
    ],
  }));

  // Modal.
  const deletionModal = (
    <ModalTransition>
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <ModalHeader hasCloseButton>
            <ModalTitle>{t('removal')}</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <p>{t('confirm_removal')}</p>
            <ul>
              <li>
                {tt('name')}: {namedChannels[removeIndex].name}
              </li>
              <li>URL: {namedChannels[removeIndex].url}</li>
              <li>
                {t('created_at')}: {new Date(namedChannels[removeIndex].createdAt).toLocaleString()}
              </li>
            </ul>
          </ModalBody>
          <ModalFooter>
            <Button appearance="subtle" onClick={closeModal}>
              {tt('cancel')}
            </Button>
            <Button
              appearance="danger"
              onClick={() => {
                removeNamedChannel();
                closeModal();
              }}
            >
              {tt('remove')}
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </ModalTransition>
  );

  // Output.
  return (
    <Stack>
      <p css={css({ padding: '8px 0' })}>{t('description')}</p>
      <LabeledTextField
        label="URL"
        value={channelURL}
        validate={isValidVoiceChannelURL}
        setValue={(v: string) => dispatch((prev) => ({ ...prev, channelURL: v.trim() }))}
        width={540}
        placeholder={t('placeholder')}
        id="discord-channel-url"
        feedback={t('feedback')}
        showStatus
      />
      <Inline alignBlock="end" spread="space-between">
        <Inline alignBlock="end">
          <Text size="small">{t('named_channels')}</Text>
        </Inline>
        <Inline alignInline="end">{newEntryField}</Inline>
      </Inline>
      <RankableTable
        id="named-channels-table"
        xcss={tableStyles}
        head={head}
        rows={rows}
        onRankEnd={(sourceIndex, destinationIndex) => {
          dispatch((prev) => {
            const newChannels = reorder({ list: prev.namedChannels, startIndex: sourceIndex, finishIndex: destinationIndex });
            return { ...prev, namedChannels: newChannels };
          });
        }}
        sortKey={namedChannelsTableSettings.sortKey}
        sortOrder={namedChannelsTableSettings.sortOrder}
        onSort={(k, o) => {
          dispatch((prev) => ({ ...prev, namedChannelsTableSettings: { sortKey: k, sortOrder: o } }));
        }}
      />
      {deletionModal}
    </Stack>
  );
};

export default DiscordChannels;
