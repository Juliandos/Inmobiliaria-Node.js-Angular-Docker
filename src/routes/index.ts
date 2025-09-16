import { Router } from 'express';
export const router = Router();

router.get('/propiedades', propiedadController.getAll);
router.get('/propiedades/:id', propiedadController.getOne);
router.post('/propiedades', propiedadController.create);
router.put('/propiedades/:id', propiedadController.update);
router.delete('/propiedades/:id', propiedadController.remove);
