//Test file for the role controller
const { StatusCodes } = require('http-status-codes');
const { createRole, showRole } = require('../controllers/roleController');
const Role = require('../models/roleModel');

//Testing create Role function
describe('Role Controller', () => {
  describe('createRole', () => {
    it('should create a new role', async () => {
      const req = {
        body: {
          name: 'Test Role',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const role = { name: 'Test Role', _id: '1' };

      Role.create = jest.fn().mockResolvedValue(role);

      await createRole(req, res);

      expect(Role.create).toHaveBeenCalledWith({ name: 'Test Role' });
      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        status: true,
        content: {
          data: role,
        },
      });
    });
  });

//Testing show role function
  describe('showRole', () => {
    it('should return all roles', async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const roles = [
        { name: 'Role 1', _id: '1' },
        { name: 'Role 2', _id: '2' },
      ];

      Role.find = jest.fn().mockResolvedValue(roles);

      await showRole(req, res);

      expect(Role.find).toHaveBeenCalledWith({});
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        status: true,
        content: {
          data: roles,
        },
      });
    });
  });
});
