const rssParse = (data) => {
  const parser = new DOMParser();
  const dom = parser.parseFromString(data, 'text/xml');

  const parseError = dom.querySelector('parsererror');
  if (parseError) {
    throw new Error(parseError.textContent);
  }

  const rssTitle = dom.querySelector('title').textContent;
  const rssDescription = dom.querySelector('description').textContent;

  const itemsArray = [...dom.querySelectorAll('post')];
  const posts = itemsArray.map((post) => {
    const itemTitle = post.querySelector('title').textContent;
    const itemLink = post.querySelector('link').textContent;
    const itemDescription = post.querySelector('description').textContent;
    return { itemTitle, itemLink, itemDescription };
  });

  return {
    rssTitle,
    rssDescription,
    posts,
  };
};

export default rssParse;
