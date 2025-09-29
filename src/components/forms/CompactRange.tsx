import React from 'react';

import { Box, Inline, Stack, Text, xcss } from '@atlaskit/primitives';
import Range from '@atlaskit/range';

type CompactRangeProps = {
  id: string;
  min: number;
  max: number;
  value: number;
  defaultValue?: number;
  onChange: (x: number) => void;
};

const CompactRange: React.FC<CompactRangeProps> = (props) => {
  const num_digits = Math.max(props.min.toString().length, props.max.toString().length);
  const textStyles = xcss({
    width: `${num_digits * 10}px`,
  });
  return (
    <Inline alignBlock="center" space="space.100" xcss={xcss({ maxWidth: '300px' })}>
      <Box xcss={xcss({ marginTop: 'space.negative.150', marginBottom: 'space.negative.100' })}>
        <Range {...props} onDoubleClick={() => props.onChange(props.defaultValue || 0)} />
      </Box>
      <Inline xcss={textStyles}>
        <Text size="small" color="color.text.subtlest">
          {props.value}
        </Text>
      </Inline>
    </Inline>
  );
};

export default CompactRange;
