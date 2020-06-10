import { Request, Response } from 'express';
import { container } from 'tsyringe';

import SendForgotPasswordService from '@modules/users/services/SendForgotPasswordEmailService';

export default class ForgotPasswordController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;

    const sendForgotPasswordService = container.resolve(
      SendForgotPasswordService,
    );

    await sendForgotPasswordService.execute({
      email,
    });

    return res.status(204).json();
  }
}
