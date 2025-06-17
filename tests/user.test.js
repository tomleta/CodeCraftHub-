const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../src/app'); // Ne pas inclure .listen ici
const User = require('../src/models/user'); // Ton modèle utilisateur
let server;

beforeAll((done) => {
  // Démarre le serveur Express pour les tests
  server = app.listen(0, () => {
    console.log('Test server started');
    done();
  });
}, 10000);

afterAll(async () => {
  // Nettoyage
  await User.deleteMany({});
  await mongoose.connection.close();

  // Ferme le serveur
  await new Promise((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
}, 10000);

describe('User Service', () => {
  it('should register a new user', async () => {
    const response = await request(server)
      .post('/api/users/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('User created successfully');
  }, 10000); // timeout individuel

  it('should login an existing user', async () => {
    // Préenregistre un utilisateur
    await request(server)
      .post('/api/users/register')
      .send({
        username: 'testuser2',
        email: 'test2@example.com',
        password: 'password123',
      });

    const response = await request(server)
      .post('/api/users/login')
      .send({
        email: 'test2@example.com',
        password: 'password123',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
  }, 10000);
});
