import { Router } from 'express';
import AttachmentController from './attachment_controller';
import { validate } from '../../middlewares/validade.middleware';
import { createAttachmentSchema } from './DTOs/create_attachment_dto';

const attachmentRouter = Router();

attachmentRouter.post('/', validate(createAttachmentSchema), AttachmentController.create);
attachmentRouter.get('/task/:taskId', AttachmentController.getAttachmentsByTaskId);
attachmentRouter.delete('/:id', AttachmentController.delete);

export default attachmentRouter;