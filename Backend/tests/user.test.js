const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../App'); // Your Express app
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

process.env.JWT_SECRET = 'test-secret-key';

let mongoServer;

beforeAll(async () => {
  // Create an in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
  
  // Set JWT_SECRET in process.env
  process.env.JWT_KEY = 'test-secret-key';
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // // Clear the database before each test
  // await User.deleteMany({});
  
  // Ensure JWT_SECRET is set before each test
  process.env.JWT_SECRET = 'test-secret-key';
});

describe('User API', () => {
  describe('POST /api/users/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(201);

      // Check response
      expect(response.body.message).toBe('User created successfully');
      expect(response.body.user).toHaveProperty('username', userData.username);
      expect(response.body.user).toHaveProperty('email', userData.email);
      expect(response.body.user).not.toHaveProperty('password');

      // Verify user was saved to database
      const user = await User.findOne({ username: userData.username });
      expect(user).toBeTruthy();
      expect(user.email).toBe(userData.email);
    });

    it('should not register user with existing username', async () => {
      // Create an existing user first
      const existingUser = new User({
        username: 'testuser',
        email: 'existing@example.com',
        password: await bcrypt.hash('password123', 8)
      });
      await existingUser.save();

      const userData = {
        username: 'testuser',
        email: 'new@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(400);

      expect(response.body.message).toMatch(/already exists/i);
    });

    it('should not register user with invalid email format', async () => {
      const userData = {
        username: 'testuser',
        email: 'invalid-email',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(400);

      expect(response.body.message).toMatch(/invalid email format/i);
    });

    it('should not register user with short password', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'short'
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(400);

      expect(response.body.message).toMatch(/password must be atleast 8 characters/i);
    });

    it('should not register user with existing email', async () => {
      // Create an existing user first
      const existingUser = new User({
        username: 'existinguser',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 8)
      });
      await existingUser.save();

      const userData = {
        username: 'newuser',
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(400);

      expect(response.body.message).toMatch(/already exists/i);
    });
  });

  describe('POST /api/users/login', () => {
    it('should login successfully with correct credentials', async () => {
      // Create a user first
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 8);
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: hashedPassword
      });
      await user.save();

      const response = await request(app)
        .post('/api/users/login')
        .send({
          username: 'testuser',
          password: password
        })
        .expect(200);

      expect(response.body.message).toBe('Login successful');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('username', 'testuser');
    });

    it('should not login with incorrect password', async () => {
      // Create a user first
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 8)
      });
      await user.save();

      const response = await request(app)
        .post('/api/users/login')
        .send({
          username: 'testuser',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.message).toMatch(/invalid username or password/i);
    });

    it('should not login with non-existent username', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          username: 'nonexistent',
          password: 'password123'
        })
        .expect(401);

      expect(response.body.message).toMatch(/invalid username or password/i);
    });

    it('should handle server errors during login', async () => {
      // Mock User.findOne to throw an error
      jest.spyOn(User, 'findOne').mockImplementationOnce(() => {
        throw new Error('Database error');
      });

      const response = await request(app)
        .post('/api/users/login')
        .send({
          username: 'testuser',
          password: 'password123'
        })
        .expect(500);

      expect(response.body.message).toBeTruthy();
    });
  });
});