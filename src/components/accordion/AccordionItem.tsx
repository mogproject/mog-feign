import React from 'react';

import { Box, Inline, Pressable, xcss } from '@atlaskit/primitives';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import { useLayoutState } from '../layout/LayoutContext';

const borderStyles = xcss({
  borderBottomColor: 'color.border',
  borderBottomStyle: 'solid',
  borderBottomWidth: 'border.width',
});

const headerStyles = xcss({
  width: '100%',
  backgroundColor: 'color.background.accent.blue.subtlest',
  ':hover': {
    backgroundColor: 'color.background.accent.blue.subtlest.hovered',
  },
  ':active': xcss({
    backgroundColor: 'color.background.accent.blue.subtlest.pressed',
  }),
});

const bodyStyles = xcss({
  overflow: 'hidden',
  transition: 'max-height 0.3s ease',
});

const bodyInnerStyles = xcss({
  paddingBlock: 'space.200',
  paddingInline: 'space.050',
});

type AccordionItemProps = {
  defaultOpen?: boolean;
  header: React.ReactNode;
  body: React.ReactNode;
  isLast?: boolean;
};

const AccordionItem: React.FC<AccordionItemProps> = ({ defaultOpen = true, header, body, isLast = false }) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const [bodyHeight, setBodyHeight] = React.useState(0);

  const layout = useLayoutState();
  const bodyRef = React.useRef<HTMLDivElement>(null);

  const bodyHeightStyles = xcss({
    maxHeight: (isOpen ? bodyHeight : 0) + 'px',
  });

  React.useEffect(() => {
    if (bodyRef.current) {
      setBodyHeight(bodyRef.current.scrollHeight);
    }
  }, [body, bodyRef.current?.scrollHeight, layout.mainWidth]);

  return (
    <>
      {/*
--------------------------------------------------------------------------------
    Header
--------------------------------------------------------------------------------
*/}
      <Pressable onClick={() => setIsOpen((v) => !v)} xcss={[headerStyles, (isOpen || !isLast) && borderStyles]} role="button">
        <Inline
          alignBlock="center"
          alignInline="center"
          spread="space-between"
          xcss={xcss({
            paddingBlock: 'space.050',
            paddingInline: 'space.150',
          })}
        >
          <Box>{header}</Box>
          <Box
            style={{
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
            }}
          >
            <ChevronDownIcon label="" size="large" />
          </Box>
        </Inline>
      </Pressable>
      {/*
--------------------------------------------------------------------------------
    Body
--------------------------------------------------------------------------------
*/}
      <Box role="region" xcss={[bodyStyles, !isLast && borderStyles, bodyHeightStyles]}>
        <Box ref={bodyRef} xcss={bodyInnerStyles}>
          {body}
        </Box>
      </Box>
    </>
  );
};

export default AccordionItem;
