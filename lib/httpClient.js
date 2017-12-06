import { setTimeout } from 'timers';

const https = require('https');
const zlib = require('zlib');
const config = require('./config.json');

class HttpClient {

  constructor (apiKey, options = {}) {
    if (!config.accept) {
      throw new Error(`Accept type is missing in configuration`);
    }

    this.apiKey = apiKey;

    this.enableGzip = options.enableGzip || true;

    this._lastResponseOn = Date.now();
    this._rateLimitRemaining = Number.MAX_SAFE_INTEGER;
    this._rateLimitReset = Number.MAX_SAFE_INTEGER;
    this._queue = [];
  }

  get (path, options) {
    if (!path) {
      throw new Error(`Path is undefined`);
    }
    if (options && typeof options !== 'object') {
      throw new TypeError(`Options must be an object`);
    }

    const serializedQuery = this._serializeOptions(options);
    const serializedPath = config.path + path + (serializedQuery ? `?${serializedQuery}` : '');

    if (this._rateLimitRemaining) {
      return this._request(serializedPath);
    } else {
      return setTimeout(() => get(path, options), this._rateLimitReset);
    }
  }

  _request (path) {
    return new Promise((resolve, reject) => {
      const request = https.request({
        method: 'GET',
        headers: this._getHeaders(),
        hostname: this._getHost(),
        path: path
      }, response => {
        this._rateLimitRemaining = response.headers['x-ratelimit-remaining'];
        this._rateLimitReset = response.headers['x-ratelimit-reset'];
        this._lastResponseOn = Date.now();

        const handler = this.enableGzip ? this._handleGzipResponse : this._handleResponse;

        handler(response)
          .then(resolve)
          .catch(reject);
      });

      request.on('error', e => {
        reject(new Error(`Error while requesting API: ${e.message}`));
      });

      request.end();
    });
  }

  _handleResponse (response) {
    return new Promise((resolve, reject) => {
      let result = '';

      response.on('data', data => {
        result += data.toString();
      });

      response.on('end', () => {
        try {
          const parsedResult = JSON.parse(result);

          resolve(parsedResult);
        } catch (ex) {
          reject(new Error(`Unable to parse result`));
        }
      });
    });
  }

  _handleGzipResponse (response) {
    return new Promise((resolve, reject) => {
      const gunzip = zlib.createGunzip();
      const buffer = [];

      response.pipe(gunzip);

      gunzip.on('data', data => buffer.push(data.toString()));

      gunzip.on('end', () => {
        const finalBuffer = buffer.join('');

        try {
          const parsedResult = JSON.parse(finalBuffer);

          resolve(parsedResult);
        } catch (ex) {
          reject(new Error(`Unable to parse result`));
        }
      });

      gunzip.on('error', error => {
        reject(new Error(`Error while requesting API (gzip enabled): ${error.message}`));
      });
    });
  }

  _getHeaders () {
    const headers = {
      'Accept': config.accept,
      'Authorization': `Bearer ${this.apiKey}`
    };

    if (this.enableGzip) {
      headers['Accept-Encoding'] = 'gzip';
    }

    return headers;
  }

  _serializeOptions (options) {
    let queryArray = [];
    for (let property in options) {
      if (typeof options[property] !== 'object') {
        queryArray.push(`${property}=${options[property]}`);
      } else {
        for (let innerProperty in options[property]) {
          queryArray.push(`${property}[${innerProperty}]=${options[property][innerProperty]}`);
        }
      }
    }
    return queryArray.join('&');
  }

  _getHost () {
    if (!config.host) {
      throw new Error(`Host is undefined`);
    }
    if (!config.datacenters || !config.datacenters.length) {
      throw new Error(`No datacenters are configured`);
    }
    // TODO: Dynamic selection
    const datacenter = config.datacenters[0];
    return config.host.replace('{datacenter}', datacenter).toLowerCase();
  }

}

module.exports = HttpClient;