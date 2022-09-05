import { setLocale } from 'yup';

setLocale({
  string: {
    url: 'validError',
    required: 'emptyError',
    notOneOf: 'existsError',
  },
  mixed: {
    notOneOf: 'existsError',
  },
});

const resources = {
  translation: {
    success: 'RSS успешно загружен',
    errors: {
      invalidUrl: 'Ссылка должна быть валидным URL',
      rssAlreadyExists: 'RSS уже существует',
      invalidRss: 'Ресурс не содержит валидный RSS',
      connectionError: 'Ошибка сети',
    },
    modal: {
      showModal: 'Просмотр',
      readArticle: 'Читать полностью',
      closeModal: 'Закрыть',
    },
  },
};

export default resources;
