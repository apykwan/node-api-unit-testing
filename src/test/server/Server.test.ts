import { Authorizer } from '../../app/auth/Authorizer';
import { ReservationsDataAccess } from '../../app/data/ReservationsDataAccess';
import { LoginHandler } from '../../app/handlers/LoginHandler';
import { RegisterHandler } from '../../app/handlers/RegisterHandler';
import { ReservationsHandler } from '../../app/handlers/ReservationsHandler';
import { Server } from '../../app/server/Server';

jest.mock('../../app/auth/Authorizer');
jest.mock('../../app/data/ReservationsDataAccess');
jest.mock('../../app/handlers/LoginHandler');
jest.mock('../../app/handlers/RegisterHandler');
jest.mock('../../app/handlers/ReservationsHandler');

const requestMock = {
  url: '',
  headers: {
    'user-agent': 'jest-test'
  }
};

const responseMock = {
  end: jest.fn(),
  writeHead: jest.fn()
};

const serverMock = {
  listen: jest.fn(),
  close: jest.fn()
};

jest.mock('http', () => {
  return {
    createServer: (cb: Function) => {
      cb(requestMock, responseMock);
      return serverMock;
    }
  }
});

describe('Server test suite', () => {
  let sut: Server

  beforeEach(() => {
    sut = new Server();
    expect(Authorizer).toHaveBeenCalledTimes(1);
    expect(ReservationsDataAccess).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should start server on port 8080 and end the request', async () => {;
    await sut.startServer();

    expect(serverMock.listen).toHaveBeenCalledWith(8080);
    expect(responseMock.end).toHaveBeenCalled();
  });

  it('should handle register requests', async () => {
    requestMock.url = 'localhost:8080/register';
    const handleRequestSpy = jest.spyOn(RegisterHandler.prototype, 'handleRequest');
    await sut.startServer();

    expect(handleRequestSpy).toHaveBeenCalledTimes(1);
    expect(RegisterHandler).toHaveBeenCalledWith(requestMock, responseMock, expect.any(Authorizer));
  });

  it('should handle login requests', async () => {
    requestMock.url = 'localhost:8080/login';
    const handleRequestSpy = jest.spyOn(LoginHandler.prototype, 'handleRequest');
    await sut.startServer();

    expect(handleRequestSpy).toHaveBeenCalledTimes(1);
    expect(LoginHandler).toHaveBeenCalledWith(requestMock, responseMock, expect.any(Authorizer));
  });

  it('should handle reservation requests', async () => {
    requestMock.url = 'localhost:8080/reservation';
    const handleRequestSpy = jest.spyOn(ReservationsHandler.prototype, 'handleRequest');
    await sut.startServer();

    expect(handleRequestSpy).toHaveBeenCalledTimes(1);
    expect(ReservationsHandler).toHaveBeenCalledWith(
      requestMock, 
      responseMock, 
      expect.any(Authorizer),
      expect.any(ReservationsDataAccess) 
    );
  });

  it('should do nothing for not supported route', async () => {
    requestMock.url = 'localhost:8080/reservation';
    const handleRequestSpy = jest.spyOn(ReservationsHandler.prototype, 'handleRequest');
    await sut.startServer();

    expect(handleRequestSpy).toHaveBeenCalledTimes(1);
    expect(ReservationsHandler).toHaveBeenCalledWith(
      requestMock, 
      responseMock, 
      expect.any(Authorizer),
      expect.any(ReservationsDataAccess) 
    );
  });
});