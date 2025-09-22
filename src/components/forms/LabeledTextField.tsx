import React from 'react';
import { css } from '@emotion/react';

import Textfield from '@atlaskit/textfield';
import { Inline } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';
import StatusSuccessIcon from '@atlaskit/icon/core/status-success';
import StatusErrorIcon from '@atlaskit/icon/core/status-error';
import Popup from '@atlaskit/popup';
import { buttonGroupNotFirstStyles, labelStyles } from './button-group-styles';

const suffixStyles = css({
  marginLeft: '8px',
});

const feedbackStyles = css({
  color: token('color.text.inverse'),
  backgroundColor: token('color.background.accent.red.bolder'),
  borderRadius: '4px',
  padding: '4px 8px',
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
  // fontSize?: number;
  showStatus: boolean;
};

const LabeledTextField: React.FC<LabeledTextFieldProps> = (props) => {
  const validIcon = <StatusSuccessIcon color={token('color.icon.success')} />;
  const invalidIcon = <StatusErrorIcon color={token('color.icon.danger')} />;

  const isEmpty = props.value === '';
  const isValid = props.validate(props.value);
  const isInvalid = !isEmpty && !isValid;

  const mainContent = (triggerProps: any) => (
    <Inline {...triggerProps} alignBlock="center">
      {/*-----------------------------------------------------------------------
          Label
        ----------------------------------------------------------------------*/}
      <span css={[labelStyles]}>{props.label}</span>
      {/*-----------------------------------------------------------------------
          Input
        ----------------------------------------------------------------------*/}
      <span>
        <Textfield
          id={props.id}
          isCompact
          css={[css({ width: props.width }), buttonGroupNotFirstStyles]}
          placeholder={props.placeholder}
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
      {props.showStatus && (
        <span css={suffixStyles}>
          {isValid && validIcon}
          {isInvalid && invalidIcon}
        </span>
      )}
    </Inline>
  );

  return (
    //------------------------------------------------------------------------
    //    Feedback
    //------------------------------------------------------------------------
    <Popup
      shouldRenderToParent
      autoFocus={false}
      placement={'bottom-start'}
      isOpen={isInvalid}
      content={() => <div css={feedbackStyles}>{props.feedback}</div>}
      trigger={mainContent}
    />
  );
};

export default LabeledTextField;
