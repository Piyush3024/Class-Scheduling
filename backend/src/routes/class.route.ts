import { Router } from 'express';
import { ClassController } from '../controllers';
import { asyncHandler } from '../middlewares';

const router = Router();


router.post('/', asyncHandler(ClassController.createClass));


router.get('/calendar', asyncHandler(ClassController.getClassesForCalendar));


router.get('/', asyncHandler(ClassController.getAllClasses));


router.get('/:id', asyncHandler(ClassController.getClassById));


router.put('/:id', asyncHandler(ClassController.updateClass));


router.delete('/:id', asyncHandler(ClassController.deleteClass));

router.patch('/:id/instances/bookings', asyncHandler(ClassController.updateInstanceBookings));
router.patch('/:id/instances/status', asyncHandler(ClassController.updateInstanceStatus));
router.patch('/:id/instances', asyncHandler(ClassController.updateInstance));
router.delete('/:id/instances', asyncHandler(ClassController.deleteInstance));
router.get('/:id/instances', asyncHandler(ClassController.getClassInstances));

export default router;
