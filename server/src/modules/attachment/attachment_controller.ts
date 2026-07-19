import { Request, Response } from 'express';
import AttachmentService from './attachment_service';

class AttachmentController {
  
  create = async (req: Request, res: Response): Promise<void> => {
    const attachment = await AttachmentService.createAttachment(req.body);

    res.status(201).json({
      message: 'Attachment created successfully.',
      data: attachment,
    });
  };

  getAttachmentsByTaskId = async (req: Request, res: Response): Promise<void> => {
    const taskId = req.params.taskId as string;
    const attachments = await AttachmentService.getAttachmentsByTaskId(taskId);

    res.status(200).json({
      message: 'Task attachments retrieved successfully.',
      data: attachments,
    });
  };


  delete = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    await AttachmentService.deleteAttachment(id);

    res.status(204).send(); 
  };
}

export default new AttachmentController();