import { IncomingMessage, ServerResponse } from "http";

import { RegisterHandler } from '../../app/handlers/RegisterHandler';
import { Authorizer } from "../../app/auth/Authorizer";
import { HTTP_CODES, HTTP_METHODS } from "../../app/model/ServerModel";
import { Account } from '../../app/model/AuthModel';

const getRequestBodyMock = jest.fn();

jest.mock('../../app/utils/Utils', () => {
  return {
    getRequestBody: () => getRequestBodyMock() 
  };
});

describe('RegisterHandler test, suite', () => {
  let sut: RegisterHandler;

  const request = {
    method: 'POST'
  };

  const responseMock = {
    statusCode: 0,
    writeHead: jest.fn(),
    write: jest.fn()
  };

  const authorizerMock = {
    registerUser: jest.fn()
  };

  const someAccount: Account = {
    id: '1234',
    password: 'somePassword',
    userName: 'someUserName'
  };

  const someId: string = "1234";

  beforeEach(() => {
    sut = new RegisterHandler(
      request as IncomingMessage,
      responseMock as any as ServerResponse,
      authorizerMock as any as Authorizer
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  }); 

  it('should register valid accoutns in requests', async () => {
    request.method = HTTP_METHODS.POST;
    getRequestBodyMock.mockResolvedValueOnce(someAccount);
    authorizerMock.registerUser.mockResolvedValueOnce(someId);

    await sut.handleRequest();

    expect(responseMock.statusCode).toBe(HTTP_CODES.CREATED);
    expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.CREATED, { 'Content-Type': 'application/json' });
    expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify({ userId: someId }));
  });

  it('should register invalid accoutns in requests', async () => {
    request.method = HTTP_METHODS.POST;
    getRequestBodyMock.mockResolvedValueOnce({});
    
    await sut.handleRequest();

    expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
    expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.BAD_REQUEST, { 'Content-Type': 'application/json' });
    expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify('userName and password required'));
  });

  it('should do nothing for not supported http methods', async () => {
    request.method = HTTP_METHODS.GET;
    await sut.handleRequest();

    expect(responseMock.writeHead).not.toHaveBeenCalled();
    expect(responseMock.write).not.toHaveBeenCalled();
    expect(getRequestBodyMock).not.toHaveBeenCalled();
  });
});