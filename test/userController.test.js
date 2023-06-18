const { StatusCodes } = require("http-status-codes");
const { signInUser, signUpUser, showUser } = require("../controllers/userController");
const User = require("../models/userModel");
const { Unauthorized, BadRequest } = require("../errors");
const sendToken = require("../utils/sendToken");

jest.mock("../utils/sendToken", () => jest.fn());

describe("User Controller", () => {
  describe("signInUser", () => {
    it("should sign in an existing user with valid credentials", async () => {
      const email = "test@example.com";
      const password = "password";

      const req = {
        body: {
          email,
          password,
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
      };

      const user = {
        email,
        password: "hashedPassword",
        isPasswordCorrect: jest.fn().mockResolvedValue(true),
      };

      User.findOne = jest.fn().mockResolvedValue(user);

      await signInUser(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email });
      expect(user.isPasswordCorrect).toHaveBeenCalledWith(password);
      expect(sendToken).toHaveBeenCalledWith(user, StatusCodes.OK, res);
    });

    it("should throw an Unauthorized error with invalid credentials", async () => {
      const email = "test@example.com";
      const password = "password";

      const req = {
        body: {
          email,
          password,
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
      };

      User.findOne = jest.fn().mockResolvedValue(null);

      await expect(signInUser(req, res)).rejects.toThrow(Unauthorized);

      expect(User.findOne).toHaveBeenCalledWith({ email });
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should throw a BadRequest error if email or password is missing", async () => {
      const req = {
        body: {},
      };

      const res = {
        status: jest.fn().mockReturnThis(),
      };

      await expect(signInUser(req, res)).rejects.toThrow(BadRequest);

      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe("signUpUser", () => {
    it("should create a new user", async () => {
      const email = "test@example.com";
      const name = "Test User";
      const password = "password";

      const req = {
        body: {
          email,
          name,
          password,
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
      };

      const createdUser = {
        email,
        name,
        password: "hashedPassword",
      };

      User.create = jest.fn().mockResolvedValue(createdUser);

      await signUpUser(req, res);

      expect(User.create).toHaveBeenCalledWith({ email, name, password });
      expect(sendToken).toHaveBeenCalledWith(createdUser, StatusCodes.CREATED, res);
    });
  });

  describe("showUser", () => {
    it("should return the details of an existing user", async () => {
      const req = {
        user: { _id: "1" },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const user = { _id: "1", email: "test@example.com", name: "Test User" };

      User.findById = jest.fn().mockResolvedValue(user);

      await showUser(req, res);

      expect(User.findById).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        status: true,
        content: {
          data: user,
        },
      });
    });
  });
});
