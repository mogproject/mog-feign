import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import DynamicTable from '@atlaskit/dynamic-table';
import Form, { ErrorMessage, Field, MessageWrapper } from '@atlaskit/form';
import TextField from '@atlaskit/textfield';
import Button, { IconButton } from '@atlaskit/button/new';
// import DynamicTable from "@atlaskit/dynamic-table/components/stateless";
import { HeadType, RowType } from '@atlaskit/dynamic-table/types';
import { Box, Inline, xcss } from '@atlaskit/primitives';

import { DiscordUser } from '../../models/DiscordUser';
import { token } from '@atlaskit/tokens';
import EditableText from '../forms/EditableText';
import EditableMultiSelect from '../forms/EditableMultiSelect';
import { OptionType, ValueType } from '@atlaskit/select';
import DeleteIcon from '@atlaskit/icon/core/delete';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle, ModalTransition } from '@atlaskit/modal-dialog';

// Note: Importing from '@atlaskit/select' breaks creatable select.
import CreatableSelect from '@atlaskit/select/CreatableSelect';
import { createOption } from '../forms/selectHelper';
import { css } from '@compiled/react';
const initialUsers: DiscordUser[] = [
  {
    id: '12345678901234',
    name: 'Alice',
    groups: ['Admin', 'Beta Tester'],
  },
  { id: '98765432109876', name: 'Bob', groups: ['Member'] },
  { id: '11112222333344', name: 'Charlie', groups: ['Moderator', 'VIP'] },
  { id: '11112222333345', name: 'Charlie 1', groups: ['Moderator', 'VIP'] },
  { id: '11112222333346', name: 'Charlie 2', groups: [] },
  { id: '11112222333347', name: 'Charlie 3', groups: ['Member', 'VIP'] },
  { id: '11112222333348', name: 'Charlie 4', groups: ['Member', 'VIP'] },
];

const readViewContainerStyles = xcss({
  display: 'flex',
  font: token('font.body'),
  maxWidth: '100%',
  paddingBlock: 'space.100',
  paddingInline: 'space.075',
  wordBreak: `break-word`,
});

const compactSelectStyles = {
  control: (base: any) => ({
    ...base,
    minHeight: '32px',
    height: '32px',
  }),
  valueContainer: (base: any) => ({
    ...base,
    paddingTop: 0,
    paddingBottom: 0,
  }),
  indicatorsContainer: (base: any) => ({
    ...base,
    height: '32px',
  }),
};

// const compactButton = css({
//   height: '32px',
//   lineHeight: '32px',
//   padding: '0 8px',
//   fontSize: '14px',
// });

function findDiscordGroups(users: DiscordUser[]) {
  return Array.from(new Set(users.flatMap((u) => u.groups))).sort();
}

type FormValues = {
  name: string;
  id: string;
  groups: ValueType<OptionType, true>;
};

function DiscordUsers() {
  const { t: translate } = useTranslation('translation', {
    keyPrefix: 'settings.discord',
  });
  const t = translate as (s: string, o?: Record<string, string | boolean>) => string;
  const tt = (k: string, o?: Record<string, string | boolean>) => {
    return t(k, { ...o, keyPrefix: '' });
  };

  const [discordUsers, setDiscordUsers] = React.useState<DiscordUser[]>(initialUsers);
  const [discordGroups, setDiscordGroups] = React.useState<string[]>(findDiscordGroups(discordUsers));

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [removeIndex, setRemoveIndex] = React.useState(-1);
  const openModal = React.useCallback(() => setIsModalOpen(true), []);
  const closeModal = React.useCallback(() => setIsModalOpen(false), []);

  const setEditValue = (index: number, key: string, value: string) => {
    const newUsers = discordUsers.map((user: DiscordUser, i: number) => (i == index ? { ...user, [key]: value } : user));
    setDiscordUsers(newUsers);
  };

  const setEditGroups = (index: number, value: ValueType<OptionType, true>) => {
    const newUsers = discordUsers.map((user: DiscordUser, i: number) =>
      i == index ? { ...user, groups: value.map((opt) => opt.label) } : user
    );
    setDiscordUsers(newUsers);
    setDiscordGroups(findDiscordGroups(newUsers));
  };

  const removeDiscordUser = () => {
    if (removeIndex < 0) return;

    const newUsers = discordUsers.filter((_, index) => index !== removeIndex);
    setRemoveIndex(-1);
    setDiscordUsers(newUsers);
    setDiscordGroups(findDiscordGroups(newUsers));
  };

  // Validations.
  const validateName = (editName: string, index: number, checkEmpty: boolean) => {
    if (!checkEmpty && editName === '') {
      return undefined;
    } else if (checkEmpty && editName === '') {
      return t('name_placeholder');
    } else if (discordUsers.some((x, i) => i !== index && x.name === editName)) {
      return t('already_exists');
    } else {
      return undefined;
    }
  };

  const validateId = (editId: string, index: number, checkEmpty: boolean) => {
    if (!checkEmpty && editId === '') {
      return undefined;
    } else if (editId === '') {
      return t('id_placeholder');
    } else if (!/^[0-9]+$/.test(editId)) {
      return t('number_only');
    } else if (discordUsers.some((x, i) => i !== index && x.id === editId)) {
      return t('already_exists');
    } else {
      return undefined;
    }
  };

  // Define header.
  const head: HeadType = {
    cells: [
      { key: 'name', content: tt('name'), isSortable: true, width: 14 },
      { key: 'id', content: 'ID', isSortable: true, width: 18 },
      { key: 'groups', content: tt('groups'), isSortable: true, width: 30 },
      { key: 'action', content: tt('remove'), isSortable: false, width: 4 },
    ],
  };

  const rows: RowType[] = discordUsers.map((user, index) => ({
    key: index.toString(),
    cells: [
      //------------------------------------------------------------------------
      //    Name
      //------------------------------------------------------------------------
      {
        key: user.name,
        content: (
          <EditableText
            defaultValue={user.name}
            readView={() => <Box xcss={readViewContainerStyles}>{user.name}</Box>}
            validate={(name) => validateName(name, index, true)}
            onConfirm={(value) => setEditValue(index, 'name', value)}
            keyPrefix={`table-name-${index}`}
          />
        ),
        // className: 'editable-table-cell',
      },

      //------------------------------------------------------------------------
      //    ID
      //------------------------------------------------------------------------
      {
        key: Number(user.id), // Compare as a number.
        content: (
          <EditableText
            defaultValue={user.id}
            readView={() => <Box xcss={xcss({ ...readViewContainerStyles, color: 'color.text.subtlest' })}>{user.id}</Box>}
            validate={(id) => validateId(id, index, true)}
            onConfirm={(value) => setEditValue(index, 'id', value)}
            keyPrefix={`table-id-${index}`}
          />
        ),
        // className: 'editable-table-cell',
      },
      //------------------------------------------------------------------------
      //    Groups
      //------------------------------------------------------------------------
      {
        key: user.groups.join('|'),
        content: (
          <EditableMultiSelect
            defaultValue={user.groups}
            options={discordGroups}
            onConfirm={(value) => setEditGroups(index, value)}
            keyPrefix={`table-groups-${index}`}
          />
        ),
      },
      //------------------------------------------------------------------------
      //    Groups
      //------------------------------------------------------------------------
      {
        content: (
          <IconButton
            icon={DeleteIcon}
            label={tt('remove')}
            appearance="subtle"
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

  const containerStyles = xcss({
    maxWidth: '1200px',
    marginInline: 'auto', // centering
    paddingInline: 'space.200', // left & right padding
  });

  const errorIconContainerStyles = xcss({
    paddingInlineEnd: 'space.075',
    // eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
    lineHeight: '100%' as any,
  });

  //----------------------------------------------------------------------------
  //    Actions
  //----------------------------------------------------------------------------

  //----------------------------------------------------------------------------
  //    Components
  //----------------------------------------------------------------------------
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
                {tt('name')}: {discordUsers[removeIndex].name}
              </li>
              <li>ID: {discordUsers[removeIndex].id}</li>
            </ul>
          </ModalBody>
          <ModalFooter>
            <Button appearance="subtle" onClick={closeModal}>
              {tt('cancel')}
            </Button>
            <Button
              appearance="danger"
              onClick={() => {
                removeDiscordUser();
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

  const newEntryField = (
    <Fragment>
      <Form<FormValues>
        key="discord-user-new"
        onSubmit={(data, form) => {
          // console.log('Data:', data);
          const name = data.name.trim();
          const id = data.id.trim();
          const groups = Array.from(new Set(data.groups.map((opt) => opt.label.trim()).filter((s) => s !== '')));

          const newUsers = [...discordUsers, { name: name, id: id, groups: groups }];
          setDiscordUsers(newUsers);
          setDiscordGroups(findDiscordGroups(newUsers));

          form.reset(); // clear all fields
        }}
      >
        {({ formProps }) => (
          <form {...formProps}>
            <Inline space="space.100" alignInline="center" alignBlock="start" shouldWrap>
              {/* name */}
              <Field<string> name="name" isRequired validate={(value) => validateName(value || '', -1, false)} defaultValue="">
                {({ fieldProps, error }) => (
                  <Box xcss={xcss({ width: '120px', marginTop: 'space.0' })}>
                    <TextField {...fieldProps} className="compact-textfield" placeholder={t('name_placeholder')} />
                    <MessageWrapper>{error && <ErrorMessage>{error}</ErrorMessage>}</MessageWrapper>
                  </Box>
                )}
              </Field>

              {/* ID */}
              <Field<string> name="id" isRequired validate={(value) => validateId(value || '', -1, false)} defaultValue="">
                {({ fieldProps, error }) => (
                  <Box xcss={xcss({ width: '150px' })}>
                    <TextField {...fieldProps} className="compact-textfield" placeholder={t('id_placeholder')} />
                    <MessageWrapper>{error && <ErrorMessage>{error}</ErrorMessage>}</MessageWrapper>
                  </Box>
                )}
              </Field>

              {/* groups */}
              <Box xcss={xcss({ flex: 1 })}>
                <Field<ValueType<OptionType, true>> name="groups" defaultValue={[]}>
                  {({ fieldProps }) => (
                    <CreatableSelect
                      {...fieldProps}
                      styles={compactSelectStyles}
                      isMulti
                      isClearable
                      placeholder={t('group_placeholder')}
                      formatCreateLabel={(s: string) => tt('create_label', { name: s })}
                      noOptionsMessage={(obj: { inputValue: string }) => t('no_options', { name: obj.inputValue })}
                      options={discordGroups.map(createOption)}
                      autoFocus={false}
                      openMenuOnFocus={false}
                    />
                  )}
                </Field>
              </Box>

              {/* add button */}
              <Box xcss={xcss({ marginTop: 'space.100' })}>
                <Button type="submit" appearance="primary" spacing="default">
                  {tt('add')}
                </Button>
              </Box>
            </Inline>
          </form>
        )}
      </Form>
    </Fragment>
  );

  //----------------------------------------------------------------------------
  //    Output
  //----------------------------------------------------------------------------
  return (
    <Box xcss={containerStyles}>
      <p>{t('description')}</p>
      <Box>
        <DynamicTable
          caption=""
          head={head}
          rows={rows}
          rowsPerPage={5}
          defaultPage={1}
          loadingSpinnerSize="large"
          isRankable
          isFixedSize
          onRankEnd={({ sourceIndex, destination }) => {
            if (destination === undefined) return;
            if (sourceIndex == destination.index) return;

            // console.log([sourceIndex, destination.index]);
            const updated = Array.from(discordUsers);
            const [moved] = updated.splice(sourceIndex, 1);
            updated.splice(destination.index, 0, moved);
            setDiscordUsers(updated);
          }}
        />
      </Box>
      {newEntryField}
      {deletionModal}
    </Box>
  );
}

export default DiscordUsers;
