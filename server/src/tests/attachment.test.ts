import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../app';

describe('Attachments Module (Integration)', () => {
  let validToken: string;

  beforeAll(() => {
    validToken = jwt.sign(
      { id: 'fake-user-id', role: 'USER' },
      process.env.JWT_ACCESS_SECRET || 'super_secret_key',
      { expiresIn: '15m' }
    );
  });
  
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
        .set('Authorization', `Bearer ${validToken}`)
        .send(invalidAttachment);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });

    it('should return a 400 error if the task ID is not a valid UUID', async () => {
      const invalidAttachment = {
        fileName: 'imagem.png',
        fileUrl: 'https://meubucket.com/imagem.png',
        fileType: 'image/png',
        taskId: 'id-invalido'
      };

      const response = await request(app)
        .post('/api/attachments')
        .set('Authorization', `Bearer ${validToken}`)
        .send(invalidAttachment);

      expect(response.status).toBe(400);
    });
  });
});