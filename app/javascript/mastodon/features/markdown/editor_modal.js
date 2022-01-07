/* eslint-disable react/prop-types */

import React from 'react';
import { Editor } from '@toast-ui/react-editor';
import Button from '../../components/button';
import PrivacyDropdownContainer from '../compose/containers/privacy_dropdown_container';
import CharacterCounter from '../../features/compose/components/character_counter';
import MarkdownButtonContainer from './button_container';

import './editor_modal.scss';
// import 'prosemirror-view/style/prosemirror.css';
import '@toast-ui/editor/dist/toastui-editor-only.css';
import './editor_viewer.scss';

function stopKeyEvent(ev) {
  ev.stopPropagation();
}

// TODO: implement upload image to mastodon
// temporarily exclude image
// Full list: https://github.com/nhn/tui.editor/blob/fa775a995954f677c13a1d2e78d98df04df582ba/apps/editor/src/editorCore.ts#L135
const toolbarItems = [
  ['heading', 'bold', 'italic', 'strike'],
  ['hr', 'quote'],
  ['ul', 'ol', 'task', 'indent', 'outdent'],
  // ['table', 'image', 'link'],
  ['table', 'link'],
  ['code', 'codeblock'],
  ['scrollSync'],
];

const linkAttributes = {
  target: '_blank',
  rel: 'noreferrer noopener',
};

const MarkdownEditorModal = React.memo(function MarkdownEditorModal({
  editorRef,
  initialMarkdown,
  publishText,
  handleSubmit,
  canSubmit,
  max,
  textForCharacterCounting,
  onEditorChange,
}) {
  const refTuiEditor = React.useRef();

  const refIsFirstRun = React.useRef(true);

  if (refIsFirstRun.current) {
    refIsFirstRun.current = false;
    editorRef.current = {
      getMarkdown: () => {
        const ins = refTuiEditor.current;
        return ins?.getMarkdown();
      },
      getHTML: () => {
        const ins = refTuiEditor.current;
        if (!ins) return undefined;
        const md = ins.getMarkdown();
        if (!md || md.trim().length === 0) return '';
        const html = ins.getHTML();
        return `<div class="toastui-editor-contents">${html}</div>`;
      },
    };
  }

  const onLoad = React.useCallback(
    (ins) => {
      refTuiEditor.current = ins;
      onEditorChange();
    },
    [onEditorChange],
  );

  return (
    <div
      className='modal-root__modal markdown-editor-modal'
      tabIndex={-1}
      onKeyDown={stopKeyEvent}
      onKeyUp={stopKeyEvent}
      onKeyPress={stopKeyEvent}
    >
      <div className='markdown-editor-modal__content'>
        <div className='markdown-editor-modal__toolbar'>
          <div className='markdown-editor-modal__toolbar__buttons'>
            {/* <UploadButtonContainer /> */}
            {/* <PollButtonContainer /> */}
            <PrivacyDropdownContainer />
            {/* <SpoilerButtonContainer /> */}
            <MarkdownButtonContainer />
          </div>
          <div className='markdown-editor-modal__toolbar__publish-area'>
            <div className='character-counter__wrapper'>
              <CharacterCounter max={max} text={textForCharacterCounting} />
            </div>
            <div className='compose-form__publish-button-wrapper'>
              <Button
                text={publishText}
                onClick={handleSubmit}
                disabled={!canSubmit}
                block
              />
            </div>
          </div>
        </div>
        <div className='markdown-editor-modal__editor-container'>
          <Editor
            initialValue={initialMarkdown}
            height='100%'
            previewStyle='vertical'
            useCommandShortcut
            usageStatistics={false}
            toolbarItems={toolbarItems}
            onChange={onEditorChange}
            onLoad={onLoad}
            linkAttributes={linkAttributes}
          />
        </div>
      </div>
    </div>
  );
});

export default MarkdownEditorModal;
