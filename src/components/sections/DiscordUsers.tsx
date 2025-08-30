import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import DynamicTable from '@atlaskit/dynamic-table';
import Form, { Field } from '@atlaskit/form';
import TextField from '@atlaskit/textfield';
import Button from '@atlaskit/button/new';
// import DynamicTable from "@atlaskit/dynamic-table/components/stateless";
import { HeadType, RowType } from '@atlaskit/dynamic-table/types';
import { Box, Inline, xcss } from '@atlaskit/primitives';

import { DiscordUser } from '../../models/DiscordUser';
import { token } from '@atlaskit/tokens';
import CreatableMultiSelect from '../forms/CreatableMultiSelect';
import EditableText from '../forms/EditableText';
import EditableMultiSelect from '../forms/EditableMultiSelect';
import { OptionType, ValueType } from '@atlaskit/select';

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
];

const readViewContainerStyles = xcss({
  display: 'flex',
  font: token('font.body'),
  maxWidth: '100%',
  paddingBlock: 'space.100',
  paddingInline: 'space.075',
  wordBreak: `break-word`,
});

function findDiscordGroups(users: DiscordUser[]) {
  return Array.from(new Set(users.flatMap((u) => u.groups))).sort();
}

function DiscordUsers() {
  const { t: translate } = useTranslation('translation', {
    keyPrefix: 'settings.discord',
  });
  const t = translate as (s: string, o?: Record<string, string | boolean>) => string;
  const tt = (k: string) => {
    return t(k, { keyPrefix: '' });
  };

  const [discordUsers, setDiscordUsers] = React.useState<DiscordUser[]>(initialUsers);
  const [discordGroups, setDiscordGroups] = React.useState<string[]>(findDiscordGroups(discordUsers));

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

  // Validations.
  const validateName = (editName: string, index: number) => {
    if (editName == '') {
      return t('name_placeholder');
    } else if (discordUsers.some((x, i) => i !== index && x.name === editName)) {
      return t('already_exists');
    } else {
      return undefined;
    }
  };

  const validateId = (editId: string, index: number) => {
    if (editId == '') {
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
      { key: 'groups', content: tt('group'), isSortable: true },
      { key: 'action', content: '', isSortable: false },
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
            validate={(name) => validateName(name, index)}
            onConfirm={(value) => setEditValue(index, 'name', value)}
          />
        ),
        className: 'editable-table-cell',
      },

      //------------------------------------------------------------------------
      //    ID
      //------------------------------------------------------------------------
      {
        key: user.id,
        content: (
          <EditableText
            defaultValue={user.id}
            readView={() => <Box xcss={xcss({ ...readViewContainerStyles, color: 'color.text.subtlest' })}>{user.id}</Box>}
            validate={(id) => validateId(id, index)}
            onConfirm={(value) => setEditValue(index, 'id', value)}
          />
        ),
        className: 'editable-table-cell',
      },
      //------------------------------------------------------------------------
      //    Groups
      //------------------------------------------------------------------------
      {
        key: user.groups.join('|'),
        content: (
          <EditableMultiSelect defaultValue={user.groups} options={discordGroups} onConfirm={(value) => setEditGroups(index, value)} />
        ),
      },
    ],
  }));

  const containerStyles = xcss({
    maxWidth: '1200px',
    marginInline: 'auto', // centering
    paddingInline: 'space.200', // left & right padding
  });

  const wrapperStyles = xcss({
    overflowX: 'auto',
  });

  //----------------------------------------------------------------------------
  //    Actions
  //----------------------------------------------------------------------------
  function handleNewEntry(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  //----------------------------------------------------------------------------
  //    Components
  //----------------------------------------------------------------------------
  const newEntryField = (
    <Fragment>
      <Form key="discord-user-new" onSubmit={handleNewEntry}>
        {({ formProps }) => (
          <form {...formProps}>
            <Inline space="space.200" alignInline="center" alignBlock="center" shouldWrap>
              {/* name */}
              <Field name="name" isRequired>
                {({ fieldProps }) => (
                  <Box xcss={{ width: '120px' }}>
                    <TextField {...fieldProps} placeholder={t('name_placeholder')} />
                  </Box>
                )}
              </Field>

              {/* ID */}
              <Field name="id" isRequired>
                {({ fieldProps }) => (
                  <Box xcss={{ width: '150px' }}>
                    <TextField {...fieldProps} placeholder={t('id_placeholder')} />
                  </Box>
                )}
              </Field>

              {/* group */}
              <div style={{ flex: 1, minWidth: 200 }}>
                <Field name="group">
                  {({ fieldProps }) => <CreatableMultiSelect options={discordGroups} placeholder={t('group_placeholder')} />}
                </Field>
              </div>

              {/* add button */}
              <div style={{ height: '48px' }}>
                <Button type="submit" appearance="primary">
                  {tt('add')}
                </Button>
              </div>
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
      <Box xcss={wrapperStyles}>
        <DynamicTable
          caption=""
          head={head}
          rows={rows}
          rowsPerPage={5}
          defaultPage={1}
          loadingSpinnerSize="large"
          isRankable
          isFixedSize
        />
      </Box>
      {newEntryField}
    </Box>
  );
}

export default DiscordUsers;
