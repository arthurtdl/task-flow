import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../app';

describe('Tasks Module (Integration)', () => {
  let validToken: string;

  beforeAll(() => {
    validToken = jwt.sign(
      { id: 'fake-user-id', role: 'USER' },
      process.env.JWT_ACCESS_SECRET || 'super_secret_key',
      { expiresIn: '15m' }
    );
  });

  describe('POST /api/tasks', () => {
    it('should return 400 error if the task data is invalid', async () => {
      const invalidTask = {
        title: 'Nova Tarefa',
        status: 'FAZENDO',
        userId: '4dee3edc-1f72-4579-b3ae-9904dcd85455'
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${validToken}`)
        .send(invalidTask);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });

    it('deve retornar erro 400 se o userId não for um UUID válido', async () => {
      const invalidTask = {
        title: 'Nova Tarefa',
        userId: 'id-invalido-comum' // Invalid UUID
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${validToken}`)
        .send(invalidTask);

      expect(response.status).toBe(400);
    });
  });
});