import { Request, Response } from 'express';
import { CrudService } from '../services/crud.service';

const service = new CrudService();

export const CrudController = {
  list: (name: string) => async (req: Request, res: Response) => res.json(await service.list(name, req.query)),
  create: (name: string) => async (req: Request, res: Response) => res.status(201).json(await service.create(name, req.body)),
  get: (name: string) => async (req: Request, res: Response) => res.json(await service.get(name, Number(req.params.id))),
  update: (name: string) => async (req: Request, res: Response) => res.json(await service.update(name, Number(req.params.id), req.body)),
  remove: (name: string) => async (req: Request, res: Response) => res.json(await service.delete(name, Number(req.params.id), req.user?.id))
};
