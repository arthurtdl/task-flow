import request from 'supertest';
import app from '../app';

describe('User Module (Integration)', () => {
  
  describe('POST /api/users', () => {
    
    it('should return error 400 if password is too short', async () => {
      // Mock
      const invalidUser = {
        name: 'Usuário Teste',
        email: 'teste@teste.com',
        password: '123' // Too short password
      };

      // Simulation of the request to the endpoint
      const response = await request(app)
        .post('/api/users')
        .send(invalidUser);

      // What we expect to happen
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });

  });
});