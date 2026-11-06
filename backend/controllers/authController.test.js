const bcrypt = require('bcrypt');
const { expect } = require('chai');
const sinon = require('sinon');

const { loginUser, registerUser } = require('../controllers/authController');
const User = require('../models/User');

const testUser = {
  name: 'Tommy Test',
  email: 'tommy@mailinator.com',
  password: 'password1',
};

const dbUser = {
  id: '123',
  name: testUser.name,
  email: testUser.email,
  password: 'hashed-password',
  role: 'staff',
};

describe('Auth controller', () => {
  // Register user
  describe('When registering a user', () => {
    let req, res, next;

    beforeEach(() => {
      sandbox = sinon.createSandbox();
      process.env.JWT_SECRET = 'jwt-secret';

      req = {
        body: {
          name: testUser.name,
          email: testUser.email,
          password: testUser.password,
        },
      };

      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      next = sinon.stub();
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should register a user', async () => {
      sandbox.stub(User, 'findOne').resolves(null);
      sandbox.stub(User, 'create').resolves({
        ...testUser,
        role: 'customer',
      });

      await registerUser(req, res, next);

      expect(res.status.calledWith(201)).to.be.true;
    });

    it('should return 400 if required fields are missing', async () => {
      req.body = {};

      await registerUser(req, res, next);

      expect(res.status.calledWith(400)).to.be.true;
    });

    it('should return 400 if email is not valid', async () => {
      req.body.email = 'invalid-email';

      await registerUser(req, res, next);

      expect(res.status.calledWith(400)).to.be.true;
    });

    it('should return 400 if password is not valid', async () => {
      req.body.password = '123';

      await registerUser(req, res, next);

      expect(res.status.calledWith(400)).to.be.true;
    });
  });

  // Login user
  describe('When logging in a user', () => {
    let req, res;

    req = {
      body: {
        name: testUser.name,
        email: testUser.email,
        password: testUser.password,
      },
    };

    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    beforeEach(() => {
      sandbox = sinon.createSandbox();
      process.env.JWT_SECRET = 'jwt-secret';
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should login a user', async () => {
      sandbox.stub(User, 'findOne').resolves(dbUser);
      sandbox.stub(bcrypt, 'compare').resolves(true);

      req.body.email = testUser.email;
      req.body.password = testUser.password;

      await loginUser(req, res);

      expect(User.findOne.calledWith({ email: testUser.email })).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const payload = res.json.firstCall.args[0];
      expect(payload).to.include({
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
      });

      expect(payload).to.have.property('token');
      expect(res.status.called).to.be.false;
    });

    it('should return 401 if user is not found', async () => {
      sandbox.stub(User, 'findOne').resolves(null);

      await loginUser(req, res);

      expect(res.status.calledWith(401)).to.be.true;
    });

    it('should return 401 if password is incorrect', async () => {
      sandbox.stub(User, 'findOne').resolves(dbUser);
      sandbox.stub(bcrypt, 'compare').resolves(false);

      await loginUser(req, res);

      expect(res.status.calledWith(401)).to.be.true;
    });
  });
});
