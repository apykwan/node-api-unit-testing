import * as generated from '../app/data/IdGenerator';
import { Server } from '../app/server/Server';
import { HTTP_METHODS, HTTP_CODES } from '../app/model/ServerModel';
import { Account } from "../app/model/AuthModel";
import { Reservation } from "../app/model/ReservationModel";
import { makeAwesomeRequest } from './utils/http_client';

describe.skip('Server app integration test', () => {
  let server: Server;

  const someUser: Account = {
    id: '',
    userName: 'joe',
    password: '12345'
  };

  const someReservation: Reservation = {
    id: '',
    endDate: 'someEndDate',
    startDate: 'someStartDate',
    room: 'someRoom',
    user: 'someUser'
  };

  beforeAll(() => {
    server = new Server();
    server.startServer();
  });

  afterAll(() => {
    server.stopServer();
  });


  it('should register new user', async () => {
    const result = await fetch('http://localhost:8080/register', {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(someUser)
    });
    const resultBody = await result.json();

    expect(result.status).toBe(HTTP_CODES.CREATED);
    expect(resultBody.userId).toBeDefined();
    console.log(`connecting to address: ${process.env.HOST}`)
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

  let token: string;
  it('should login the registered user', async () => {
    const result = await fetch('http://localhost:8080/login', {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(someUser)
    });
    const resultBody = await result.json();

    expect(result.status).toBe(HTTP_CODES.CREATED);
    expect(resultBody.token).toBeDefined();
    token = resultBody.token;
  });

  let createdReservationId: string;
  it('should create reservation if authorized', async () => {
    const result = await fetch('http://localhost:8080/reservation', {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(someReservation),
      headers: {
        authorization: token
      }
    });
    const resultBody = await result.json();

    expect(result.status).toBe(HTTP_CODES.CREATED);
    expect(resultBody.reservationId).toBeDefined();
    createdReservationId = resultBody.reservationId;
  });

  it('should get reservation if authorized', async () => {
    const result = await fetch(`http://localhost:8080/reservation/${createdReservationId}`, {
      method: HTTP_METHODS.GET,
      headers: {
        authorization: token
      }
    });
    const resultBody = await result.json();

    const expectedReservation = structuredClone(someReservation);
    expectedReservation.id = createdReservationId;

    expect(result.status).toBe(HTTP_CODES.OK);
    expect(resultBody).toEqual(expectedReservation);
  });

  it('should create and retrieve multiple reservation if authorized', async () => {
    await fetch('http://localhost:8080/reservation', {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(someReservation),
      headers: {
        authorization: token
      }
    });

    await fetch('http://localhost:8080/reservation', {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(someReservation),
      headers: {
        authorization: token
      }
    });

    await fetch('http://localhost:8080/reservation', {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(someReservation),
      headers: {
        authorization: token
      }
    });

    const getAllResult = await fetch(`http://localhost:8080/reservation/all`, {
      method: HTTP_METHODS.GET,
      headers: {
        authorization: token
      }
    });

    const resultBody = await getAllResult.json();
    expect(getAllResult.status).toBe(HTTP_CODES.OK);
    expect(resultBody).toHaveLength(4);
  });

  it('should update reservation if authorized', async () => {
    const updateResult = await fetch(`http://localhost:8080/reservation/${createdReservationId}`, {
      method: HTTP_METHODS.PUT,
      body: JSON.stringify({
        startDate: 'otherStartDate'
      }),
      headers: {
        authorization: token
      }
    });

    expect(updateResult.status).toBe(HTTP_CODES.OK);

    const getResult = await fetch(`http://localhost:8080/reservation/${createdReservationId}`, {
      method: HTTP_METHODS.GET,
      headers: {
        authorization: token
      }
    });
    const getRequestBody: Reservation = await getResult.json();
    expect(getRequestBody.startDate).toBe('otherStartDate');
  });

  it('should delete reservation if authorized', async () => {
    const deleteResult = await fetch(`http://localhost:8080/reservation/${createdReservationId}`, {
      method: HTTP_METHODS.DELETE,
      headers: {
        authorization: token
      }
    });

    expect(deleteResult.status).toBe(HTTP_CODES.OK);

    const getResult = await fetch(`http://localhost:8080/reservation/${createdReservationId}`, {
      method: HTTP_METHODS.GET,
      headers: {
        authorization: token
      }
    });

    expect(getResult.status).toBe(HTTP_CODES.NOT_FOUND);
  });

  it('snapshot demo', async () => {
    jest.spyOn(generated, 'generateRandomId').mockReturnValueOnce('1234');

    await fetch('http://localhost:8080/reservation', {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(someReservation),
      headers: {
        authorization: token
      }
    });

    const getResult = await fetch(`http://localhost:8080/reservation/12345`, {
      method: HTTP_METHODS.GET,
      headers: {
        authorization: token
      }
    });
    const getRequestBody: Reservation = await getResult.json();

    expect(getRequestBody).toMatchSnapshot();
  });
});