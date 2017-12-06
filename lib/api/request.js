class Request {

  constructor (httpClient, url) {
    if (!httpClient) {
      throw new Error(`HTTP client not provided`);
    }
    if (!url) {
      throw new Error(`URL not provided`);
    }

    this.httpClient = httpClient;
    this.url = url;

    this.reset();
  }

  get () {
    const result = this.httpClient.get(this.url, this.options);

    this.reset();

    return result;
  }

  filter (filter) {
    if (filter && typeof filter === 'object') {
      for (let propertyName in filter) {
        this.options.filter[propertyName] = filter[propertyName];
      }
    }

    return this;
  }

  skip (value) {
    if (value) {
      this.options.page['offset'] = value;
    }

    return this;
  }

  limit (value) {
    if (value) {
      this.options.page['limit'] = value;
    }

    return this;
  }

  sort (fieldName) {
    if (fieldName) {
      this.options['sort'] = fieldName;
    }

    return this;
  }

  from (date) {
    if (date) {
      this.options.filter['createdAt-start'] = date;
    }

    return this;
  }

  to (date) {
    if (date) {
      this.options.filter['createdAt-end'] = date;
    }

    return this;
  }

  reset () {
    this.options = {
      page: {},
      filter: {}
    };
  }

}

module.exports = Request;