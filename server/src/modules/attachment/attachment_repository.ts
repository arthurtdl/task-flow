import prisma from "@database";
import { Prisma, Attachment } from "@prisma/client";

class AttachmentRepository {
  async createAttachment(data: Prisma.AttachmentUncheckedCreateInput): Promise<Attachment> {
    const attachment = await prisma.attachment.create({ data });
    return attachment;
  }

  async getAttachmentById(id: string): Promise<Attachment | null> {
    const attachment = await prisma.attachment.findUnique({
      where: { id },
    });
    return attachment;
  }

  async getAttachmentsByTaskId(taskId: string): Promise<Attachment[]> {
    const attachments = await prisma.attachment.findMany({
      where: { taskId },
      orderBy: { createdAt: 'desc' }
    });
    return attachments;
  }

  async deleteAttachment(id: string): Promise<Attachment> {
    const attachment = await prisma.attachment.delete({
      where: { id },
    });
    return attachment;
  }
}

export default new AttachmentRepository();
