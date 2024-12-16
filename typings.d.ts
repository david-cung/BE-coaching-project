import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any; // Replace `any` with the actual type of your decoded token, if known
    }
  }
}
