import { Server } from '../app/server/Server';
import { HTTP_METHODS, HTTP_CODES } from '../app/model/ServerModel';
import { Account } from "../app/model/AuthModel";
import { makeAwesomeRequest } from './utils/http_client';

describe('Server app integration test', () => {
  let server: Server;

  beforeAll(() => {
    server = new Server();
    server.startServer();
  });

  afterAll(() => {
    server.stopServer();
  });

  const someUser: Account = {
    id: '',
    userName: 'joe',
    password: '12345'
  }

  it('should register new user', async () => {
    const result = await fetch('http://localhost:8080/register', {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(someUser)
    });

    const resultBody = await result.json();
    expect(result.status).toBe(HTTP_CODES.CREATED);
    expect(resultBody.userId).toBeDefined();
  });

  it('should register new user with awesomeRequest', async () => {
    const result = await makeAwesomeRequest({
      host: 'localhost',
      port: 8080,
      method: HTTP_METHODS.POST,
      path: '/register'
    }, someUser);

    expect(result.statusCode).toBe(HTTP_CODES.CREATED);
    expect(result.body.userId).toBeDefined();
  });
});