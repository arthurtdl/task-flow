import request from 'supertest';
import app from '../app';

describe('Tasks Module (Integration)', () => {
  describe('POST /api/tasks', () => {
    it('should return 400 error if the task data is invalid', async () => {
      const invalidTask = {
        title: 'Nova Tarefa',
        status: 'FAZENDO',
        userId: '4dee3edc-1f72-4579-b3ae-9904dcd85455'
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(invalidTask);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });

    it('deve retornar erro 400 se o userId não for um UUID válido', async () => {
      const invalidTask = {
        title: 'Nova Tarefa',
        userId: 'id-invalido-comum' // Is not UUID
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(invalidTask);

      expect(response.status).toBe(400);
    });
  });
});