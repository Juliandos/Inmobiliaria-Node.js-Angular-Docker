// controllers/propiedadController.ts
import { Request, Response, NextFunction } from 'express';
import { PropiedadService } from '../services/propiedadService';

export const propiedadController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const props = await PropiedadService.findAll();
      res.json(props);
    } catch (err) { next(err); }
  },
  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const prop = await PropiedadService.findById(req.params.id);
      res.json(prop);
    } catch (err) { next(err); }
  },
  // create, update, remove similares...
};
