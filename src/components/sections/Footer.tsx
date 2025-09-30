import React from 'react';
import { useTranslation } from 'react-i18next';
import { css } from '@emotion/react';
import invariant from 'tiny-invariant';

import { Box, Inline, xcss } from '@atlaskit/primitives';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle, ModalTransition } from '@atlaskit/modal-dialog';
import { token } from '@atlaskit/tokens';
import Link from '@atlaskit/link';
import Button from '@atlaskit/button/new';

const containerStyles = xcss({
  marginInline: 'auto', // centering
  paddingInline: 'space.200', // left & right padding
  paddingBlock: 'space.100',
});

const linkStyles = css({
  color: token('color.link'),
  textDecoration: 'none',
  cursor: 'pointer',
});

const piLink = 'https://piyonyuxu.fanbox.cc/posts/4943228';
const alfeLink = 'https://obs-discord-icon.alfebelow.com/';
const komiLink = 'https://koumi-hashiba.fanbox.cc/posts/7790890';

const Footer: React.FC = () => {
  const { t: translate } = useTranslation('translation', { keyPrefix: 'settings.overlay' });
  const t = translate as (s: string, o?: Record<string, string | boolean>) => string;
  const tt = (k: string) => t(k, { keyPrefix: '' });

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalContent, setModalContent] = React.useState({ title: '', body: <></> });

  const openModal = React.useCallback(() => setIsModalOpen(true), []);
  const closeModal = React.useCallback(() => setIsModalOpen(false), []);

  const createLink = React.useCallback(
    (title: string, link: string) => (
      <Link href={link} target="_blank" rel="noreferrer">
        {title}
      </Link>
    ),
    []
  );

  const createItem = React.useCallback(
    (author: string, title: string, link: string) => (
      <li>
        {author}
        <ul>
          <li>{createLink(title, link)}</li>
        </ul>
      </li>
    ),
    [createLink]
  );

  const supportedBrowsersContent = React.useMemo(
    () => (
      <>
        <p>This website was tested on the following browsers.</p>
        <ul>
          <li>
            {createLink('Google Chrome', 'https://google.com/chrome')} (Recommended)
            <ul>
              <li>Version 140.0.7339.133 (Official Build) (arm64)</li>
            </ul>
          </li>
          <li>{createLink('Mozilla Firefox', 'https://mozilla.org/firefox')}</li>
        </ul>
        <p>Mobile screens are not supported.</p>
      </>
    ),
    [createLink]
  );

  const specialThanksContent = React.useMemo(
    () => (
      <>
        <p>This work was heavily inspired by the following awesome creators.</p>
        <ul>
          {createItem('ぴよんゆぅ', 'pixivFANBOX', piLink)}
          {createItem('alfe_below', 'OBSのDiscordアイコン外観変更ジェネレーター', alfeLink)}
          {createItem('羽柴紅魅', 'pixivFANBOX', komiLink)}
        </ul>
      </>
    ),
    [createItem]
  );

  const modal = (
    <ModalTransition>
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <ModalHeader hasCloseButton>
            <ModalTitle>{modalContent.title}</ModalTitle>
          </ModalHeader>
          <ModalBody>{modalContent.body}</ModalBody>
          <ModalFooter>
            <Button appearance="default" onClick={closeModal}>
              OK
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </ModalTransition>
  );

  return (
    <>
      <Box xcss={containerStyles}>
        <Inline spread="space-between">
          <span
            css={linkStyles}
            onClick={() => {
              setModalContent({ title: 'Supported Browsers', body: supportedBrowsersContent });
              openModal();
            }}
          >
            Supported Browsers
          </span>
          <Inline space="space.050" alignBlock="center" xcss={xcss({color: 'color.text.subtlest'})}>
            <span
              css={linkStyles}
              onClick={() => {
                setModalContent({ title: 'Special Thanks', body: specialThanksContent });
                openModal();
              }}
            >
              Special Thanks
            </span>
            <span>-</span>
            <span>Feign CSS Generator &copy; 2024-2025</span>
            {createLink('mogproject', 'https://mogproject.com')}
          </Inline>
        </Inline>
      </Box>
      {modal}
    </>
  );
};

export default Footer;
