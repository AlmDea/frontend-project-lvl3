/* eslint-disable implicit-arrow-linebreak */
import axios from 'axios';
import rssParse from './parser.js';

export default (url) =>
  axios
    .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`)
    .then((res) => rssParse(url, res.data.contents));
