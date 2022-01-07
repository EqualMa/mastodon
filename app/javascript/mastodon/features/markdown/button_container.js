/* eslint-disable react/prop-types */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { injectIntl, defineMessages } from 'react-intl';
import IconButton from '../../components/icon_button';
import { changeMarkdown } from '../../actions/compose';

const messages = defineMessages({
  enable: { id: 'markdown.enable', defaultMessage: 'Enable markdown' },
  disable: { id: 'markdown.disable', defaultMessage: 'Disable markdown' },
});

const selector = (state) => {
  const enabled = !!state.getIn(['compose', 'markdown']);
  return {
    enabled,
  };
};

const iconButtonStyle = {
  height: null,
  lineHeight: '27px',
};

function MarkdownButton({ intl }) {
  const { enabled } = useSelector(selector);

  const title = React.useMemo(
    () => intl.formatMessage(enabled ? messages.disable : messages.enable),
    [enabled],
  );

  const dispatch = useDispatch();

  const onClick = React.useCallback(() => {
    dispatch(changeMarkdown(!enabled));
  }, [dispatch, enabled]);

  return (
    <IconButton
      icon={
        // Copied from [font-awesome@5](https://fontawesome.com/v5.15/icons/markdown)
        <svg
          role='img'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 640 512'
          display='block'
        >
          <path
            fill='currentColor'
            d='M593.8 59.1H46.2C20.7 59.1 0 79.8 0 105.2v301.5c0 25.5 20.7 46.2 46.2 46.2h547.7c25.5 0 46.2-20.7 46.1-46.1V105.2c0-25.4-20.7-46.1-46.2-46.1zM338.5 360.6H277v-120l-61.5 76.9-61.5-76.9v120H92.3V151.4h61.5l61.5 76.9 61.5-76.9h61.5v209.2zm135.3 3.1L381.5 256H443V151.4h61.5V256H566z'
          />
        </svg>
      }
      active={enabled}
      title={title}
      onClick={onClick}
      inverted
      style={iconButtonStyle}
    />
  );
}

export default injectIntl(React.memo(MarkdownButton));
