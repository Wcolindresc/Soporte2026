import { Router } from 'express';
import { CrudController } from '../controllers/crud.controller';

export function buildCrud(path: string) {
  const r = Router();
  r.get('/', CrudController.list(path));
  r.post('/', CrudController.create(path));
  r.get('/:id', CrudController.get(path));
  r.put('/:id', CrudController.update(path));
  r.delete('/:id', CrudController.remove(path));
  return r;
}
