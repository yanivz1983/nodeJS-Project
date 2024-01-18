// src/middleware/is-admin.ts
import { RequestHandler, Request } from "express";
import { BizCardsError } from "../error/biz-cards-error";
import { auth } from "../service/auth-service";
import { User } from "../database/model/user";

const extractToken = (req: Request) => {
  const authHeader = req.header("Authorization");

  if (
    authHeader &&
    authHeader.length > 7 &&
    authHeader.toLowerCase().startsWith("bearer ")
  ) {
    return authHeader.substring(7);
  }

  throw new BizCardsError("Token is missing in Authorization header", 400);
};

const isAdmin: RequestHandler = async (req, res, next) => {
  try {
    const token = extractToken(req);

    const { email } = auth.verifyJWT(token);

    const user = await User.findOne({ email });

    const isAdmin = user?.isAdmin;

    if (isAdmin) {
      return next();
    }

    return res.status(401).json({ message: "Must be admin" });
  } catch (error) {
    next(error);
  }
};

export { isAdmin, extractToken };
