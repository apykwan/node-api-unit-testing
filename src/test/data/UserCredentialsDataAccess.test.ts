import { UserCredentialsDataAccess } from '../../app/data/UserCredentialsDataAccess';
import { DataBase } from '../../app/data/DataBase';
import { Account } from '../../app/model/AuthModel';

const insertMock = jest.fn();
const getByMock = jest.fn();

jest.mock('../../app/data/DataBase', () => {
  return {
    DataBase: jest.fn().mockImplementation(() => {
      return {
        insert: insertMock,
        getBy: getByMock
      }
    })
  };
});

describe.only('UserCredentialsDataAccess test suite', () => {
  let sut: UserCredentialsDataAccess;

  const someAccount: Account = {
    id: '1234',
    password: 'somePassword',
    userName: 'someUserName'
  };

  const someId = '1234';

  beforeEach(() => {
    sut = new UserCredentialsDataAccess();
    expect(DataBase).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add user and return the id', async () => {
    insertMock.mockResolvedValueOnce(someId);

    const actualId = await sut.addUser(someAccount);
    expect(actualId).toBe(someId);
    expect(insertMock).toHaveBeenCalledWith(someAccount);
  });

  it('should get user by id', async () => {
    getByMock.mockResolvedValueOnce(someAccount);

    const actualUser = await sut.getUserById(someId);
    expect(actualUser).toEqual(someAccount);
    expect(getByMock).toHaveBeenCalledWith('id', someId);
  });

  it('should get user by name', async () => {
    getByMock.mockResolvedValueOnce(someAccount);

    const actualUser = await sut.getUserByUserName(someAccount.userName);
    expect(actualUser).toEqual(someAccount);
    expect(getByMock).toHaveBeenCalledWith('userName', someAccount.userName);
  });
});