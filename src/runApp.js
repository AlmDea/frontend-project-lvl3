/* eslint-disable comma-dangle */
/* eslint-disable implicit-arrow-linebreak */
// / * eslint-disable implicit-arrow-linebreak */
// / * eslint-disable no-shadow */
// / * eslint-disable comma-dangle */
import 'bootstrap';
import axios from 'axios';
import i18next from 'i18next';
import { object, string } from 'yup';
import { uniqueId } from 'lodash';
import rssParse from './parser.js';
import ru from './resources.js';
import watch from './render.js';

export default async () => {
  const addProxy = (url) => {
    const proxy = 'https://allorigins.hexlet.app/get';
    const urlWithProxy = new URL(proxy);
    urlWithProxy.searchParams.set('url', url);
    urlWithProxy.searchParams.set('disableCache', 'true');
    return urlWithProxy.toString();
  };

  const elements = {
    urlForm: document.querySelector('form'),
    feedsArea: document.querySelector('.feeds'),
    feedsList: document.querySelector('.feed-list'),
    postsArea: document.querySelector('.posts'),
    postsList: document.querySelector('.post-list'),
    button: document.querySelector('[aria-label="add"]'),
    input: document.querySelector('input'),
    column: document.querySelector('.col-md-10'),
    feedback: document.createElement('p'),
  };

  const validateForm = (state, url) => {
    const previousURLs = state.feeds.map((feed) => feed.url);
    const schema = object({
      url: string().url().required().notOneOf(previousURLs),
    });
    return schema.validate({ url });
  };

  const handleErrors = (error) => {
    switch (error.message) {
      case 'Network Error':
        return 'networkError';
      case 'Parsing Error':
        return 'invalidRSS';
      default:
        return 'defaultError';
    }
  };

  const i18n = i18next.createInstance();
  i18n
    .init({
      lng: 'ru',
      debug: true,
      resources: {
        ru,
      },
    })
    .then(() => {
      const state = {
        formValidation: {
          state: 'waiting',
          error: null,
        },
        dataLoading: {
          state: 'waiting',
          error: null,
        },
        uiState: {
          seenPosts: new Set(),
        },
        feeds: [],
        posts: [],
      };

      const watchedState = watch(state, i18n, elements);

      const loadPosts = (userUrl) => {
        watchedState.dataLoading.state = 'processing';
        const url = addProxy(userUrl);
        axios
          .get(url)
          .then((response) => {
            const XML = response.data.contents;
            const feed = rssParse(XML, 'application/xml');
            watchedState.feeds.push({ ...feed, url: userUrl });
            const posts = feed.posts.map((post) => ({
              ...post,
              postId: uniqueId(),
            }));
            watchedState.posts.push(...posts);
            watchedState.dataLoading.state = 'successful';
            watchedState.dataLoading.state = 'waiting';
          })
          .catch((error) => {
            watchedState.dataLoading.error = handleErrors(error);
            watchedState.dataLoading.state = 'failed';
            console.error(error);
            watchedState.dataLoading.state = 'waiting';
          });
      };

      const updateFeed = () => {
        const feeds = watchedState.feeds.map((feed) => {
          const url = addProxy(feed.url);
          return axios
            .get(url)
            .then((response) => {
              const XML = response.data.contents;
              const updatedFeed = rssParse(XML, 'application/xml');
              const newPosts = updatedFeed.posts.filter(
                (post) =>
                  !watchedState.posts.map((el) => el.link).includes(post.link)
              );
              if (newPosts.length > 0) {
                watchedState.posts.push(
                  ...newPosts.map((post) => ({ ...post, postId: uniqueId() }))
                );
                watchedState.uiState.state = 'updatingFeed';
              }
            })
            .catch((error) => {
              console.error(error);
            });
        });
        const delay = 5000;
        Promise.all(feeds).finally(setTimeout(updateFeed, delay, state));
      };

      elements.urlForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const url = data.get('url');
        validateForm(state, url)
          .then(() => {
            watchedState.formValidation.state = 'valid';
            loadPosts(url, state);
          })
          .catch((error) => {
            watchedState.formValidation.error = error.message;
            watchedState.formValidation.state = 'invalid';
            console.error(error);
          });
        updateFeed(watchedState);
      });

      elements.postsArea.addEventListener(
        'click',
        (e) => {
          const postButton = e.target;
          const targetPost = watchedState.posts.find(
            ({ id }) => id === postButton
          );

          watchedState.UIState.shownPosts.push({ postButton: targetPost.id });
        },
        true
      );
      updateFeed(watchedState);
    });
};
