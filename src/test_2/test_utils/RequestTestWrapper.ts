import { HTTP_METHODS } from '../../app/model/ServerModel';

export class RequestTestWrapper {
  public body: object | undefined;
  public method: HTTP_METHODS | undefined;
  public url: string | undefined;
  public headers = {} as any;

  public on(event: string, cb: Function) {
    if (event == 'data') {
      cb(JSON.stringify(this.body));
    } else {
      cb();
    }
  }

  public clearFields() {
    this.body = undefined;
    this.method = undefined;
    this.url = undefined;
    this.headers = {};
  }
}