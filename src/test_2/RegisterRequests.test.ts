import { DataBase } from '../app/data/DataBase';
import { Server } from '../app/server/Server';
import { RequestTestWrapper } from './test_utils/RequestTestWrapper';
import { ResponseTestWrapper } from './test_utils/ResponseTestWrapper';
import { HTTP_METHODS, HTTP_CODES } from '../app/model/ServerModel';

jest.mock('../app/data/DataBase');

const requestWrapper = new RequestTestWrapper();
const responseWrapper = new ResponseTestWrapper();

const fakeServer = {
  listen: () => {},
  close: () => {}
};

jest.mock('http', () => ({
  createServer: (cb: Function) => {
    cb(requestWrapper, responseWrapper) 
    return fakeServer;
  }
}));

describe('Register requests test suites', () => {
  afterEach(() => {
    requestWrapper.clearFields();
    responseWrapper.clearFields();
  });

  it('should register new users', async () => {
    requestWrapper.method = HTTP_METHODS.POST;
    requestWrapper.body = {
      userName: 'JohnDoe',
      password: 'password'
    };
    requestWrapper.url = 'localhost:8080/register';
    // jest.spyOn(DataBase.prototype, 'insert').mockResolvedValueOnce('1234');
    jest.spyOn(DataBase.prototype, 'insert').mockReturnValueOnce(Promise.resolve('1234'));

    await new Server().startServer();
    await  new Promise(process.nextTick); // This solves timing issues

    expect(responseWrapper.statusCode).toBe(HTTP_CODES.CREATED);
    expect(responseWrapper.body).toEqual(expect.objectContaining({
      userId: expect.any(String)
    }));
  });

   it('should reject request with no username nor password', async () => {
    requestWrapper.method = HTTP_METHODS.POST;
    requestWrapper.body = {};
    requestWrapper.url = 'localhost:8080/register';

    await new Server().startServer();
    await new Promise(process.nextTick); // This solves timing issues

    expect(responseWrapper.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
    expect(responseWrapper.body).toBe('userName and password required');
  });

  it('should do nothing for not support methods', async () => {
    requestWrapper.method = HTTP_METHODS.DELETE;
    requestWrapper.body = {};
    requestWrapper.url = 'localhost:8080/register';

    await new Server().startServer();
    await  new Promise(process.nextTick); // This solves timing issues

    expect(responseWrapper.statusCode).toBeUndefined();
    expect(responseWrapper.body).toBeUndefined();
  });
});