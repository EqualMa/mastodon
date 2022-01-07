/* eslint-disable react/prop-types */

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { injectIntl } from 'react-intl';
import { length } from 'stringz';
import ModalRoot from '../ui/components/modal_root';
import { getPublishText } from '../compose/components/compose_form';
import { changeMarkdown, submitCompose } from '../../actions/compose';
import { withRouter } from 'react-router-dom';

const EditorModal = () =>
  import(
    /* webpackChunkName: "modals/markdown_editor_modal" */ './editor_modal'
  );

function selector(state) {
  const md = state.getIn(['compose', 'markdown']);
  const enabled = !!md;
  const editorRef = md?.editorRef;
  const initialMarkdown = md?.initialMarkdown;

  const compose = {
    privacy: state.getIn(['compose', 'privacy']),
    spoiler: state.getIn(['compose', 'spoiler']),
    spoilerText: state.getIn(['compose', 'spoiler_text']),
    isSubmitting: state.getIn(['compose', 'is_submitting']),
    isChangingUpload: state.getIn(['compose', 'is_changing_upload']),
    isUploading: state.getIn(['compose', 'is_uploading']),
    anyMedia: state.getIn(['compose', 'media_attachments']).size > 0,
  };

  return {
    enabled,
    editorRef,
    initialMarkdown,
    compose,
  };
}

function useEditorModal({ intl, history }) {
  const max = 500;
  const {
    compose: {
      privacy,
      spoiler,
      spoilerText,
      isSubmitting,
      isUploading,
      isChangingUpload,
      anyMedia,
    },
    enabled,
    editorRef,
    ...props
  } = useSelector(selector);
  const dispatch = useDispatch();

  const onClose = React.useCallback(() => {
    dispatch(changeMarkdown(false));
  }, [dispatch]);

  const publishText = getPublishText({ intl, privacy });

  const [textHtml, setTextHtml] = React.useState('');

  const onEditorChange = React.useCallback(() => {
    const ins = editorRef?.current;
    const markdown = ins?.getMarkdown();
    const html = markdown ? ins?.getHTML() || '' : '';
    setTextHtml(html);
  }, [editorRef]);

  const textForCharacterCounting = `${spoiler ? spoilerText : ''}${textHtml}`;
  const isOnlyWhitespace = textForCharacterCounting.trim().length === 0;

  const canSubmit = !(
    isSubmitting ||
    isUploading ||
    isChangingUpload ||
    length(textForCharacterCounting) > max ||
    (isOnlyWhitespace && !anyMedia)
  );

  const handleSubmit = React.useCallback(() => {
    if (!canSubmit) {
      return;
    }
    dispatch(submitCompose(history));
  }, [dispatch, canSubmit, history]);

  return {
    enabled,
    onClose,
    modalProps: {
      ...props,
      max,
      textForCharacterCounting,
      editorRef,
      publishText,
      canSubmit,
      handleSubmit,
      onEditorChange,
    },
  };
}

const EditorModalContainer = React.memo(function EditorModalContainer({
  intl,
  history,
}) {
  const { enabled, onClose, modalProps } = useEditorModal({ intl, history });

  return (
    <ModalRoot
      type={enabled ? EditorModal : null}
      className='markdown-editor-modal-root'
      onClose={onClose}
      props={modalProps}
    />
  );
});

export default injectIntl(withRouter(EditorModalContainer));
