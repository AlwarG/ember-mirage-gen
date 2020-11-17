import Component from '@ember/component';
import layout from '../templates/components/mirage-gen-copy-paste';

export default Component.extend({
  layout,
  isCopied: false,

  didInsertElement() {
    this._super(...arguments);
    let $editor = this.element.querySelector(`#${this.editorId}`);
    ['click', 'blur'].forEach((eventName) => {
      $editor.addEventListener(eventName, () => this.setCopyContentStatus());
    });
  },

  willDestroyElement() {
    this._super(...arguments);
    let $editor = this.element.querySelector(`#${this.editorId}`);
    ['click', 'blur'].forEach((eventName) => {
      $editor.removeEventListener(eventName, () => this.setCopyContentStatus());
    });
  },

  setCopyContentStatus() {
    this.set('isCopied', false);
  },

  actions: {
    copyContent() {
      let $editor = this.element.querySelector(`#${this.editorId}`);
      if ($editor) {
        let range = document.createRange();
        range.selectNodeContents($editor);
        let sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        document.execCommand("copy");
        this.set('isCopied', true);
      }
    }
  }
});
