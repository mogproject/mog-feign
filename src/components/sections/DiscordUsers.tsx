import React, { Fragment } from 'react';
import DynamicTable from '@atlaskit/dynamic-table';
import Form, { Field, FormFooter } from '@atlaskit/form';
import TextField from '@atlaskit/textfield';
import Button from '@atlaskit/button/new';
// import DynamicTable from "@atlaskit/dynamic-table/components/stateless";
import { HeadType, RowType } from '@atlaskit/dynamic-table/types';
import Lozenge from '@atlaskit/lozenge';
import { DiscordUser } from '../../models/DiscordUser';
import { Box, Inline, xcss } from '@atlaskit/primitives';
import { useTranslation } from 'react-i18next';

import { token } from '@atlaskit/tokens';
import CreatableMultiSelect from '../forms/CreatableMultiSelect';

const initialUsers: DiscordUser[] = [
  {
    id: '12345678901234',
    name: 'Alice',
    groups: ['Admin', 'Beta Tester'],
  },
  { id: '98765432109876', name: 'Bob', groups: ['Member'] },
  { id: '11112222333344', name: 'Charlie', groups: ['Moderator', 'VIP'] },
];

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
    key: user.id,
    cells: [
      // name
      { key: user.name, content: <div style={{ color: token('color.text') }}>{user.name}</div> },

      // id
      { key: user.id, content: <div style={{ color: token('color.text.subtlest') }}>{user.id}</div> },

      // groups
      {
        key: user.groups.join('|'),
        content: (
          <Inline space="space.100">
            {user.groups.map((group) => (
              <Lozenge key={group}>{group}</Lozenge>
            ))}
          </Inline>
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
                    <TextField {...fieldProps} placeholder={tt('name')} />
                  </Box>
                )}
              </Field>

              {/* ID */}
              <Field name="id" isRequired>
                {({ fieldProps }) => (
                  <Box xcss={{ width: '150px' }}>
                    <TextField {...fieldProps} placeholder="ID" />
                  </Box>
                )}
              </Field>

              {/* group */}
              <div style={{ flex: 1, minWidth: 200 }}>
                <Field name="group">{({ fieldProps }) => <CreatableMultiSelect initialOptions={discordGroups} />}</Field>
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
      <div css={wrapperStyles}>
        <DynamicTable
          caption=""
          head={head}
          rows={rows}
          rowsPerPage={15}
          defaultPage={1}
          loadingSpinnerSize="large"
          isRankable
          isFixedSize
        />
      </div>
      {newEntryField}
    </Box>
  );
}

export default DiscordUsers;
