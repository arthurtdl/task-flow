import request from 'supertest';
import app from '../app';

describe('Attachments Module (Integration)', () => {
  
  describe('POST /api/attachments', () => {
    it('should return a 400 error if the file URL is invalid', async () => {
      const invalidAttachment = {
        fileName: 'documento.pdf',
        fileUrl: 'isso-nao-e-um-link-valido', // Invalid URL
        fileType: 'application/pdf',
        taskId: '11111111-1111-1111-1111-111111111111'
      };

      const response = await request(app)
        .post('/api/attachments')
        .send(invalidAttachment);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });

    it('should return a 400 error if the task ID is not a valid UUID', async () => {
      const invalidAttachment = {
        fileName: 'imagem.png',
        fileUrl: 'https://meubucket.com/imagem.png',
        fileType: 'image/png',
        taskId: 'id-invalido' // Not a valid UUID
      };

      const response = await request(app)
        .post('/api/attachments')
        .send(invalidAttachment);

      expect(response.status).toBe(400);
    });
  });
});