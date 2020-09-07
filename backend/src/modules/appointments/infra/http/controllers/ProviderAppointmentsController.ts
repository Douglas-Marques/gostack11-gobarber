import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';

export default class ProviderAppointmentsController {
  public async index(req: Request, res: Response): Promise<Response> {
    const user_id = req.user.id;
    const { day, month, year } = req.body;

    const listProviderAppointmentsService = container.resolve(
      ListProviderAppointmentsService,
    );

    const appointments = await listProviderAppointmentsService.execute({
      userId: user_id,
      day,
      month,
      year,
    });

    // delete appointment.id;
    // delete appointment.provider_id;
    // delete appointment.user_id;

    return res.json(appointments);
  }
}
