import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import ProvidersController from '@modules/appointments/infra/http/controllers/ProvidersController';

const providersRouter = Router();
const appointmentController = new ProvidersController();

providersRouter.use(ensureAuthenticated);

providersRouter.get('/', appointmentController.index);

export default providersRouter;
