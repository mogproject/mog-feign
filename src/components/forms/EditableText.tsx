import React from 'react';
import InlineEdit from '@atlaskit/inline-edit';
import { Box, xcss } from '@atlaskit/primitives';
import InlineDialog from '@atlaskit/inline-dialog';
import TextField from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import { css } from '@emotion/react';

const compactTextFieldStyles = css({
  height: '24px !important',
  margin: '0',
  padding: '0 0 0 1px',
});

interface EditableTextProps {
  defaultValue: string;
  readView: () => React.ReactNode;
  validate: (value: string) => string | undefined;
  onConfirm: (value: string) => void;
  keyPrefix: string;
}

const errorIconContainerStyles = xcss({
  paddingInlineEnd: 'space.075',
  // eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
  lineHeight: '100%' as any,
});

const EditableText: React.FC<EditableTextProps> = ({ defaultValue, readView, validate, onConfirm, keyPrefix }) => {
  const [editVersion, setEditVersion] = React.useState(0);
  let validateTimeoutId: number | undefined;

  React.useEffect(() => {
    return () => {
      if (validateTimeoutId) {
        window.clearTimeout(validateTimeoutId);
      }
    };
  });

  const validateWrapper = (value: string) => {
    const trimmed = value.trim();
    const errorMessage = validate(trimmed);

    return new Promise<{ value: string; error: string } | undefined>((resolve) => {
      validateTimeoutId = window.setTimeout(() => {
        if (errorMessage === undefined) {
          resolve(undefined);
        } else {
          resolve({ value: trimmed, error: errorMessage });
        }
      }, 100);
    }).then((validateObject) => {
      if (validateObject && validateObject.value === trimmed) {
        return validateObject.error;
      }
      return undefined;
    });
  };

  const onConfirmWrapper = (value: string) => {
    const trimmed = value.trim();
    setEditVersion(editVersion + 1);
    onConfirm(trimmed);
  };

  return (
    <div css={css({ marginTop: '-8px' })}>
      <InlineEdit
        hideActionButtons={false}
        defaultValue={defaultValue}
        key={`${keyPrefix}-${editVersion}`}
        editView={({ errorMessage, ...fieldProps }) => (
          <InlineDialog isOpen={fieldProps.isInvalid} content={<Box>{errorMessage}</Box>} placement="right">
            <TextField
              {...fieldProps}
              css={compactTextFieldStyles}
              elemAfterInput={
                fieldProps.isInvalid && (
                  <Box xcss={errorIconContainerStyles}>
                    <ErrorIcon label="error" primaryColor={token('color.icon.danger')} />
                  </Box>
                )
              }
              autoFocus
            />
          </InlineDialog>
        )}
        readView={readView}
        validate={validateWrapper}
        onConfirm={onConfirmWrapper}
      />
    </div>
  );
};

export default EditableText;
