import { Reservation } from '../app/model/ReservationModel';

expect.extend({
  toBeValidReservation(reservation: Reservation) {
    const validId = reservation.id.length > 5 ? true: false;
    const validUser = reservation.id.length > 5 ? true: false;
    return {
      pass: validId && validUser,
      message: () => 'expected reservation to have valid id and user.'
    }
  },
  toHaveUser(reservation: Reservation, user: string) {
    const hasUser = user == reservation.user;
    return {
      pass: hasUser,
      message: () => `expected reservation to have user ${user}, received ${reservation.user}`
    }
  }
});

interface CustomMatchers<T> {
  toBeValidReservation(): T,
  toHaveUser(user: string): T
}

declare global {
  namespace jest {
    interface Matchers<R> extends CustomMatchers<R> {}
  }
}

const someReservation: Reservation = {
  id: '123456',
  endDate: 'someEndDate',
  startDate: 'someStartDate',
  room: 'someRoom',
  user: 'someUser'
};

describe('custom matchers test', () => {
  it('should check for valid reservation', () => {
    expect(someReservation).toBeValidReservation();
    expect(someReservation).toHaveUser('someUser');
  });
});