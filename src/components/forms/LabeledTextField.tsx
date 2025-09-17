import React from 'react';
import { css } from '@emotion/react';

import Textfield from '@atlaskit/textfield';
import { Inline, Text } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';
import StatusSuccessIcon from '@atlaskit/icon/core/status-success';
import StatusErrorIcon from '@atlaskit/icon/core/status-error';
import InlineDialog from '@atlaskit/inline-dialog';

const labelStyles = css({
  padding: '5px 8px',
  backgroundColor: token('color.background.input.hovered'),
  borderRadius: '3px 0 0 3px',
  borderWidth: '1px',
  borderColor: token('color.border.accent.gray'),
  borderStyle: 'solid',
  borderRight: 'none',
});

const suffixStyles = css({
  marginLeft: '8px',
});

type LabeledTextFieldProps = {
  id: string;
  label: string;
  /** Width of the text field in pixels. */
  width: number;
  value: string;
  setValue: (newValue: string) => void;
  validate: (s: string) => boolean;
  placeholder: string;
  feedback: string;
  fontSize?: number;
};

const LabeledTextField: React.FC<LabeledTextFieldProps> = (props) => {
  const textFieldStylesInner = {
    width: props.width,
    borderRadius: `0 3px 3px 0`,
  };
  const textFieldStyles = css(textFieldStylesInner);
  const textFieldClass = `css-${textFieldStyles.name}`;

  const feedbackStyles = css({
    margin: '-16px -24px',
    color: token('color.text.inverse'),
    backgroundColor: token('color.background.accent.red.bolder'),
    borderRadius: '4px',
    padding: '18px 24px',
  });

  const validIcon = <StatusSuccessIcon color={token('color.icon.success')} />;
  const invalidIcon = <StatusErrorIcon color={token('color.icon.danger')} />;

  const isEmpty = props.value === '';
  const isValid = props.validate(props.value);
  const isInvalid = !isEmpty && !isValid;

  return (
    <InlineDialog
      //------------------------------------------------------------------------
      //    Feedback
      //------------------------------------------------------------------------
      content={<span css={feedbackStyles}>{props.feedback}</span>}
      isOpen={isInvalid}
      placement="bottom-start"
    >
      <Inline alignBlock="center">
        {/*-----------------------------------------------------------------------
            Label
          ----------------------------------------------------------------------*/}
        <span css={[labelStyles]}>{props.label}</span>
        {/*-----------------------------------------------------------------------
            Input
          ----------------------------------------------------------------------*/}
        <span css={css({ [`.${textFieldClass}`]: textFieldStylesInner })}>
          <Textfield
            id={props.id}
            isCompact
            // We need to define className instead of css for the outer div.
            className={textFieldClass}
            placeholder={props.placeholder}
            // Styling the inner input.
            // style={{ fontSize: props.fontSize }}
            value={props.value}
            isInvalid={isInvalid}
            onChange={(e) => {
              props.setValue((e.target as HTMLInputElement).value);
            }}
          />
        </span>
        {/*-----------------------------------------------------------------------
            Status Icon
          ----------------------------------------------------------------------*/}
        <span css={suffixStyles}>
          {isValid && validIcon}
          {isInvalid && invalidIcon}
        </span>
      </Inline>
    </InlineDialog>
  );
};

export default LabeledTextField;
