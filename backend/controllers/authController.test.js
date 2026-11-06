const { expect } = require('chai');
const sinon = require('sinon');

const { registerUser } = require('../controllers/authController');
const User = require('../models/User');

const testUser = {
  name: 'Tommy Test',
  email: 'tommy@mailinator.com',
  password: 'password1',
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
  });
});
