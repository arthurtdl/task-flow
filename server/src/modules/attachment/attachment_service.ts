import AttachmentRepository from './attachment_repository';
import TaskRepository from '../tasks/task_repository';
import { CreateAttachmentDTO } from './DTOs/create_attachment_dto';
import { HttpException } from '../../middlewares/httpException';

class AttachmentService {
  async createAttachment(data: CreateAttachmentDTO) {
    // Verify that the task exists before creating an attachment
    const taskExists = await TaskRepository.getTaskById(data.taskId);
    if (!taskExists) {
      throw new HttpException(404, 'Task not found. Cannot add attachment.');
    }

    const attachment = await AttachmentRepository.createAttachment(data);
    return attachment;
  }

  async getAttachmentsByTaskId(taskId: string) {
    const taskExists = await TaskRepository.getTaskById(taskId);
    if (!taskExists) {
      throw new HttpException(404, 'Task not found.');
    }

    const attachments = await AttachmentRepository.getAttachmentsByTaskId(taskId);
    return attachments;
  }

  async deleteAttachment(id: string) {
    const attachmentExists = await AttachmentRepository.getAttachmentById(id);
    if (!attachmentExists) {
      throw new HttpException(404, 'Attachment not found.');
    }

    await AttachmentRepository.deleteAttachment(id);
  }
}

export default new AttachmentService();