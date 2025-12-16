const request = require('supertest');
const app = require('./server');

describe('Backend API Tests', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('message', 'Backend is running');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /', () => {
    it('should return API information', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('version', '1.0.0');
      expect(response.body).toHaveProperty('endpoints');
    });
  });

  describe('GET /api/items', () => {
    it('should return all items', async () => {
      const response = await request(app)
        .get('/api/items')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body).toHaveProperty('count');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('POST /api/items', () => {
    it('should create a new item', async () => {
      const newItem = {
        name: 'Test Item',
        description: 'This is a test item'
      };

      const response = await request(app)
        .post('/api/items')
        .send(newItem)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('name', newItem.name);
      expect(response.body.data).toHaveProperty('description', newItem.description);
      expect(response.body).toHaveProperty('message', 'Item created successfully');
    });

    it('should return validation error for missing fields', async () => {
      const response = await request(app)
        .post('/api/items')
        .send({ name: 'Test' }) // Missing description
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Validation error');
    });
  });

  describe('GET /api/stats', () => {
    it('should return API statistics', async () => {
      const response = await request(app)
        .get('/api/stats')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('totalItems');
      expect(response.body.data).toHaveProperty('serverTime');
      expect(response.body.data).toHaveProperty('uptime');
      expect(response.body.data).toHaveProperty('memory');
      expect(response.body.data).toHaveProperty('version', '1.0.0');
    });
  });

  describe('404 handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/unknown-route')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Route not found');
    });
  });
});