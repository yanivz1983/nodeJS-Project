import { RequestHandler } from "express";
import { auth } from "../service/auth-service";
import { User } from "../database/model/user";
import { extractToken } from "./is-admin";
import { BizCardsError } from "../error/biz-cards-error";
import { IUser } from "../@types/user";

const isUser: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const token = extractToken(req);

    if (!token) {
      throw new BizCardsError("Token not provided", 401);
    }

    const { email } = auth.verifyJWT(token);

    if (!email) {
      throw new BizCardsError("Invalid token", 401);
    }

    const user = (await User.findOne({ email }).lean()) as IUser;

    if (!user) {
      throw new BizCardsError("User does not exist", 401);
    }

    req.user = user;

    if (!user._id) {
      throw new BizCardsError("User ID is missing or invalid", 401);
    }

    if (id === user._id.toString()) {
      return next();
    }

    res.status(401).json({ message: "The ID must belong to the user" });
  } catch (e) {
    next(e);
  }
};

export { isUser };
