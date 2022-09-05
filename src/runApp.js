/* eslint-disable no-param-reassign, no-console  */

import i18next from 'i18next';
import onChange from 'on-change';

const render = (elements, i18n) => (path, value, prevValue) => {
  switch (path) {
    case 'form.processState':
      handleProcessState(elements, value, i18n);
      break;

    case 'form.processError':
      handleProcessError();
      break;

    case 'form.valid':
      // elements.submitButton.disabled = !value;
      break;

    case 'form.errors':
      renderErrors(elements, value, prevValue);
      break;

    default:
      break;
  }
};

export default () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.getElementById('url-input'),
    submitButton: document.querySelector('button[type="submit"]'),
    feedback: document.querySelector('.feedback'),
  };

  const state = {
    form: {
      valid: true,
      processState: 'filling',
      processError: null,
      errors: '',
      url: '',
    },
    addedFeeds: [],
  };

  const i18n = i18next.createInstance();
  i18n.init({
    debug: true,
  });

  const watchedState = onChange(state, render(elements));

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const value = formData.get('url');

    validateUrl(value, watchedState.addedFeeds, i18n)
      .then((url) => {
        watchedState.form.url = url;
        watchedState.form.errors = '';
        watchedState.addedFeeds.push(url);
        watchedState.form.processState = 'adding';
      })
      .catch((err) => {
        watchedState.form.processState = 'error';
        watchedState.form.errors = err.message;
        watchedState.form.valid = false;
      });
  });
};
