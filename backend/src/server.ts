import 'reflect-metadata';
import 'express-async-errors';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

import routes from './routes';
import uploadConfig from './config/upload';
import AppError from './errors/AppError';

import './database';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);

app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof AppError)
    return res.status(err.statusCode).json({
      status: err.statusCode,
      message: err.message,
    });

  console.error(err);

  return res.status(500).json({
    status: 500,
    message: 'Internal server error!',
  });
});

app.listen(3333, () => {
  console.log('🚀 Server started on port 3333!');
});
