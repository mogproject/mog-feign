import { useTranslation } from 'react-i18next';

import Button, { IconButton, SplitButton } from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import { Box, Inline, Stack, Text, xcss } from '@atlaskit/primitives';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faUpload } from '@fortawesome/free-solid-svg-icons';
import { DiscordUser } from '../../models/detail/DiscordUser';
import FileLoader from '../../io/FileLoader';
import FileSaver from '../../io/FileSaver';
import DiscordUsers from './DiscordUsers';
import { useAppState } from '../../models/ContextProvider';

function settings2json(settings: { [key: string]: any }, anonymizeDiscordUsers: boolean): string {
  if (anonymizeDiscordUsers) {
    // Create anonymous users from player IDs.
    const activeIDs: string[] = settings.feignPlayers.filter((id: string) => id !== '');
    const anonymizedUsers: DiscordUser[] = activeIDs.map((id: string, i: number) => {
      return { name: `user-${i}`, id: id, groups: [] };
    });
    return JSON.stringify({ channelURL: settings.channelURL, discordUsers: anonymizedUsers, feignPlayers: settings.feignPlayers });
  } else {
    return JSON.stringify(settings);
  }
}

const SaveButton: React.FC = () => {
  const { t: translate } = useTranslation('translation', { keyPrefix: 'settings.saveload' });
  const t = translate as (s: string) => string;
  // const fileLoader = new FileLoader('file-loader');
  const fileSaver = new FileSaver();

  const {
    channelURL,
    namedChannels,
    namedChannelsTableSettings,
    discordUsers,
    discordUsersTableSettings,
    currentUserGroup,
    feignPlayers,
    viewSettings,
  } = useAppState();

  const all_settings = () => {};

  return (
    <Inline space="space.400">
      <SplitButton>
        <Button
          onClick={() =>
            fileSaver.saveTextToFile(
              () =>
                settings2json(
                  { channelURL: channelURL, discordUsers: discordUsers, feignPlayers: feignPlayers, viewSettings: viewSettings },
                  false
                ),
              'feign-discord.json'
            )
          }
        >
          <Inline space="space.100" alignBlock="center">
            <FontAwesomeIcon icon={faDownload} />
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
            <DropdownItem>Option one</DropdownItem>
            <DropdownItem>Option two</DropdownItem>
          </DropdownItemGroup>
        </DropdownMenu>
      </SplitButton>

      <SplitButton>
        <Button>
          <Inline space="space.100" alignBlock="center">
            <FontAwesomeIcon icon={faDownload} />
            Link work item
          </Inline>
        </Button>
        <DropdownMenu<HTMLButtonElement>
          shouldRenderToParent
          trigger={({ triggerRef, ...triggerProps }) => (
            <IconButton ref={triggerRef} {...triggerProps} icon={ChevronDownIcon} label="More link work item options" />
          )}
        >
          <DropdownItemGroup>
            <DropdownItem>Option one</DropdownItem>
            <DropdownItem>Option two</DropdownItem>
          </DropdownItemGroup>
        </DropdownMenu>
      </SplitButton>
    </Inline>
  );
};

const SaveLoad: React.FC = () => {
  const { t: translate } = useTranslation('translation', { keyPrefix: 'settings.saveload' });
  const t = translate as (s: string) => string;

  return (
    <>
      <Stack xcss={xcss({ paddingTop: 'space.100' })} space="space.100">
        <Text>{t('description')}</Text>
        <SaveButton />
      </Stack>
    </>
  );
};

export default SaveLoad;
