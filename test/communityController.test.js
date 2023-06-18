//Tests for community controllers
const { StatusCodes } = require('http-status-codes');
const communityController = require('../controllers/communityController');
const Community = require('../models/communityModel');
const User = require('../models/userModel');
const Member = require('../models/memberModel');
const Role = require('../models/roleModel');
const ApiFeatures = require('../utils/api-features');
const mongoose = require('mongoose');

jest.mock('../models/communityModel');
jest.mock('../models/userModel');
jest.mock('../models/memberModel');
jest.mock('../models/roleModel');

describe('Community Controller' , () => {
    //Test create community controller
 describe('createCommunity', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    });
  it('should create a new community and associated admin member', async () => {
    const req = {
      body: {
        name: 'New Community',
      },
      user: {
        _id: 'user-id-1',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const createdCommunity = {
      _id: 'community-id-1',
      name: 'New Community',
      owner: 'user-id-1',
    };

    const createdAdminRole = {
      _id: 'role-id-1',
      name: 'Community Admin',
    };

    Community.create.mockResolvedValue(createdCommunity);
    Role.create.mockResolvedValue(createdAdminRole);

    await communityController.createCommunity(req, res);

    expect(Community.create).toHaveBeenCalledWith({
      name: 'New Community',
      owner: 'user-id-1',
    });
    expect(Member.create).toHaveBeenCalledWith({
      community: 'community-id-1',
      user: { _id: 'user-id-1' },
      role: createdAdminRole,
    });
    expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
    expect(res.json).toHaveBeenCalledWith({
      status: true,
      content: {
        data: createdCommunity,
      },
    });
  });
 });
 //Test get all community controller
 describe('getAllCommunity', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
      });
    it('should get all communities with associated owner', async () => {
      const req = {
        query: {},
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      const communitiesPerPage = 10;
      const populatedCommunities = [
        {
          _id: 'community-id-1',
          name: 'Community 1',
          owner: 'owner-id-1',
        },
        {
          _id: 'community-id-2',
          name: 'Community 2',
          owner: 'owner-id-2',
        },
      ];
      const count = 2;
  
      const mockQuery = {
        lean: jest.fn().mockReturnValue(populatedCommunities),
      };
  
      Community.find.mockReturnValue(mockQuery);
      Community.countDocuments.mockResolvedValue(count);
  
  
      await communityController.getAllCommunity(req, res);
  
      expect(Community.find).toHaveBeenCalled();
      expect(ApiFeatures).toHaveBeenCalledWith(mockQuery, req.query);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        status: true,
        content: {
          meta: {
            total: count,
            pages: 1,
            page: 1,
          },
          data: populatedCommunities,
        },
      });
    });
  });
//test get all members controller
describe('getAllCommunityMembers', () => {
    it('should retrieve all members of a community with associated user and role', async () => {
      const req = {
        params: {
          id: 'community-id-1',
        },
        query: {},
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      const membersPerPage = 10;
      const populatedMembers = [
        {
          _id: 'member-id-1',
          community: 'community-id-1',
          user: 'user-id-1',
          role: 'role-id-1',
        },
        {
          _id: 'member-id-2',
          community: 'community-id-1',
          user: 'user-id-2',
          role: 'role-id-2',
        },
      ];
      const count = 2;
  
      const mockQuery = {
        lean: jest.fn().mockReturnValue(populatedMembers),
      };
  
      Member.find.mockReturnValue(mockQuery);
      Member.countDocuments.mockResolvedValue(count);
  
      User.findById.mockImplementation((userId) => ({
        name: `User ${userId}`,
        _id: userId,
      }));
  
      Role.findById.mockImplementation((roleId) => ({
        name: `Role ${roleId}`,
        _id: roleId,
      }));
  
      await communityController.getAllCommunityMembers(req, res);
  
      expect(Member.find).toHaveBeenCalledWith({ community: 'community-id-1' });
      expect(ApiFeatures).toHaveBeenCalledWith(mockQuery, req.query);
      expect(User.findById).toHaveBeenCalledTimes(2);
      expect(Role.findById).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        status: true,
        content: {
          meta: {
            total: count,
            pages: 1,
            page: 1,
          },
          data: [
            {
              user: {
                name: 'User user-id-1',
                _id: 'user-id-1',
              },
              role: {
                name: 'Role role-id-1',
                _id: 'role-id-1',
              },
            },
            {
              user: {
                name: 'User user-id-2',
                _id: 'user-id-2',
              },
              role: {
                name: 'Role role-id-2',
                _id: 'role-id-2',
              },
            },
          ],
        },
      });
    });
  });
  //test get owned communities
  describe('getOwnedCommunity', () => {
    beforeEach(() => {
      // Clear all mocks before each test
      jest.clearAllMocks();
    });
    jest.mock('../models/communityModel');
    const MockedCommunity = Community;
  
    it('should return the owned communities of the user', async () => {
      const req = {
        user: { _id: 'user-id' },
        query: { page: 1 },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      // Mock the APIFeatures class
      jest.mock('../utils/api-features');
      const MockedApiFeatures = ApiFeatures;
      const apiFeaturesInstance = {
        pagination: jest.fn().mockReturnThis(),
        query: MockedCommunity.find(),
      };
  
      // Mock the find method of the Community model
      const ownedCommunities = [{ name: 'Community 1' }, { name: 'Community 2' }];
      MockedCommunity.find.mockResolvedValue(ownedCommunities);
  
      await communityController.getOwnedCommunity(req, res);
  
      expect(MockedCommunity.find).toHaveBeenCalledWith({ owner: 'user-id' });
      expect(MockedApiFeatures).toHaveBeenCalledWith(MockedCommunity.find(), req.query);
      expect(apiFeaturesInstance.pagination).toHaveBeenCalledWith(10); // Assuming 10 communities per page
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        status: true,
        content: {
          meta: {
            total: ownedCommunities.length,
            pages: 1, // Assuming only 2 owned communities in this test case
            page: 1,
          },
          data: ownedCommunities,
        },
      });
    });
  });
});




