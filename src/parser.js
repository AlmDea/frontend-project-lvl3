const rssParse = (data) => {
  const parser = new DOMParser();
  const dom = parser.parseFromString(data, 'text/xml');

  const parseError = dom.querySelector('parsererror');
  if (parseError) {
    throw new Error(parseError.textContent);
  }

  const rssTitle = dom.querySelector('title').textContent;
  const rssDescription = dom.querySelector('description').textContent;

  const itemsArray = [...dom.querySelectorAll('item')];
  const posts = itemsArray.map((item) => {
    const itemTitle = item.querySelector('title').textContent;
    const itemLink = item.querySelector('link').textContent;
    const itemDescription = item.querySelector('description').textContent;
    return { itemTitle, itemLink, itemDescription };
  });

  return {
    rssTitle,
    rssDescription,
    posts,
  };
};

export default rssParse;
