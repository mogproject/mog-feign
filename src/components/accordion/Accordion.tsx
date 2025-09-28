import React from 'react';
import { Box, xcss } from '@atlaskit/primitives';

const accordionStyles = xcss({
  marginTop: 'space.200',
  borderStyle: 'solid',
  borderWidth: 'border.width',
  borderColor: 'color.border',
  borderRadius: 'border.radius',
  backgroundColor: 'elevation.surface',
  overflow: 'hidden',
});

type AccordionProps = {
  children: React.ReactNode;
};

const Accordion: React.FC<AccordionProps> = ({ children }) => {
  return <Box xcss={accordionStyles}>{children}</Box>;
};

export default Accordion;
