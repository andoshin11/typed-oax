import { parse } from 'url';
import * as Http from 'http';
import * as Https from 'https';

export class Fetcher {
  constructor (private url: string) {}

  fetch() {
    if (!this.url.startsWith('http')) {
      throw new Error('Invalid protocol')
    }

    return new Promise<string>((resolve, reject) => {
      const uri = parse(this.url)
      const { hostname, protocol, path } = uri;
      const port = uri.port && Number.parseInt(uri.port, 10);
      const requester = protocol === 'https:' ? Https.request : Http.request;
      const reqParam = { hostname, protocol, path, port, method: 'GET' };

      let body = '';

      const req = requester(reqParam, res => {
        res.on('data', chunk => (body += chunk));
        res.on('end', () => {
          if (!res.statusCode || res.statusCode < 200 || res.statusCode > 300) {
            reject({
              statusCode: res.statusCode,
              body,
            });
          } else {
            try {
              resolve(body);
            } catch (e) {
              reject(e);
            }
          }
        });
      });

      req.on('error', reason => reject(reason));
      req.end();
    })
  }
}
