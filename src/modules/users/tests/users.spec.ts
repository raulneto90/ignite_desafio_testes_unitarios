import {app} from '../../../app'
import request from 'supertest';
import { Connection } from 'typeorm';

import createConnection from '../../../database';
import { UsersRepository } from '../repositories/UsersRepository';

describe('UsersController', () => {
  let connection: Connection;

  beforeAll(async () => {
    connection = await createConnection();
  })

  afterAll(async () => {
    await connection.close();
  })

  beforeEach(async () => {
    await connection.runMigrations()
  })

  afterEach(async () => {
    await connection.dropDatabase()
  })

  it('should be able to create a new user', async () => {
    await request(app).post('/api/v1/users').send({
      email: 'test@test.com.br',
      name: 'User test',
      password: '123456'
    }).expect(201);
  })

  it('should not be able to create a new user with same email from another', async () => {

    await request(app).post('/api/v1/users').send({
      email: 'test@test.com.br',
      name: 'User test',
      password: '123456'
    }).expect(201);

    await request(app).post('/api/v1/users').send({
      email: 'test@test.com.br',
      name: 'User test',
      password: '123456'
    }).expect(400)
  })

  it('should be able to authenticate user', async () => {
    await request(app).post('/api/v1/users').send({
      email: 'test@test.com.br',
      name: 'User test',
      password: '123456'
    }).expect(201);

    await request(app).post('/api/v1/sessions').send({
      email: 'test@test.com.br',
      password: '123456'
    }).expect(200)
  })

  it('should not be able to authenticate a non existent user', async () => {
    await request(app).post('/api/v1/sessions').send({
      email: 'test@test.com.br',
      password: '123456'
    }).expect(401)
  })

  it('should not be able to authenticate a user with wrong password', async () => {
    await request(app).post('/api/v1/users').send({
      email: 'test@test.com.br',
      name: 'User test',
      password: '123456'
    }).expect(201);

    await request(app).post('/api/v1/sessions').send({
      email: 'test@test.com.br',
      password: '1234526'
    }).expect(401)
  })

  it('should be able to show user profile', async () => {
    await request(app).post('/api/v1/users').send({
      email: 'test@test.com.br',
      name: 'User test',
      password: '123456'
    }).expect(201);

    const authResponse = await request(app).post('/api/v1/sessions').send({
      email: 'test@test.com.br',
      password: '123456'
    }).expect(200)

    await request(app).get('/api/v1/profile').auth(authResponse.body.token, {type: 'bearer'}).expect(200)
  })

  it('should be able to show user profile if its not authenticated', async () => {
    await request(app).get('/api/v1/profile').auth('token', {type: 'bearer'}).expect(401)
  })


})
