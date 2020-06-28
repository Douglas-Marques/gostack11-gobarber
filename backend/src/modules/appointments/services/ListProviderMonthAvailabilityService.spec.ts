import 'reflect-metadata';

import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailabilityService: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    listProviderMonthAvailabilityService = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list month availability from provider', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'user_id',
      date: new Date(2020, 8, 21, 8, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'user_id2',
      date: new Date(2020, 5, 21, 8, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'user_id2',
      date: new Date(2020, 5, 21, 9, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'user_id2',
      date: new Date(2020, 5, 21, 10, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'user_id2',
      date: new Date(2020, 5, 21, 11, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'user_id2',
      date: new Date(2020, 5, 21, 12, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'user_id2',
      date: new Date(2020, 5, 21, 13, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'user_id2',
      date: new Date(2020, 5, 21, 14, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'user_id2',
      date: new Date(2020, 5, 21, 15, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'user_id2',
      date: new Date(2020, 5, 21, 16, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'user_id2',
      date: new Date(2020, 5, 21, 17, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'user_id',
      date: new Date(2020, 5, 22, 8, 0, 0),
    });

    const availability = await listProviderMonthAvailabilityService.execute({
      userId: 'user_id2',
      month: 6,
      year: 2020,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 20, available: true },
        { day: 21, available: false },
        { day: 22, available: true },
        { day: 23, available: true },
      ]),
    );
  });
});
