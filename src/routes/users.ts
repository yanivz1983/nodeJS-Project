import { Router } from "express";
import { ILogin } from "../@types/user";
import { User } from "../database/model/user";
import { validateLogin } from "../middleware/validation";
import { createUser, validateUser } from "../service/user-service";
import { isAdmin } from "../middleware/is-admin";
import { isAdminOrUser } from "../middleware/is-admin-or-user";

import { Logger } from "../logs/logger";
import LoginAttempt from "../database/schema/LoginAttempt";
import { validateToken } from "../middleware/validate-token";

const router = Router();

router.get("/", isAdmin, async (req, res, next) => {
  try {
    const allUsers = await User.find();
    res.json(allUsers);
  } catch (error) {
    Logger.error(`Error fetching all users: ${(error as Error).message}`);
    next(error);
  }
});

router.post("/", isAdminOrUser, async (req, res, next) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }
    const newUser = await createUser(req.body);
    const { password, ...rest } = newUser.toObject();
    return res.json({ user: rest, message: "User created successfully" });
  } catch (e) {
    next(e);
  }
});

// Route to get user details by ID
router.get("/:id", isAdminOrUser, async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Omit sensitive information like password
    const { password, ...rest } = user;

    Logger.verbose(`User details retrieved for user: ${id}`);
    res.json({ user: rest });
  } catch (error) {
    Logger.error(`Error fetching user details: ${(error as Error).message}`);
    next(error);
  }
});

router.patch("/:id", isAdmin, validateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isBusiness } = req.body;

    if (typeof isBusiness !== "boolean") {
      return res.status(400).json({
        error: "'isBusiness' field is required and must be a boolean",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      { _id: id },
      { isBusiness },
      { new: true }
    );

    if (updatedUser) {
      Logger.info(`User updated successfully: ${updatedUser._id}`);
      return res.json(updatedUser); // Use return to exit after sending response
    } else {
      Logger.warn(`User not found or update did not change any fields`);
      return res
        .status(404)
        .json({ error: "User not found or update did not change any fields" });
    }
  } catch (error) {
    Logger.error(`Error updating user: ${(error as Error).message}`);
    next(error);
  }
});

router.delete("/:id", isAdminOrUser, async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteUser = await User.findOneAndDelete({ _id: id });
    Logger.verbose(`User deleted successfully: ${id}`);
    res.json(deleteUser);
  } catch (error) {
    console.error(`Error deleting user: ${(error as Error).message}`);
    next(error);
  }
});

router.post("/login", validateLogin, async (req, res, next) => {
  try {
    const { email, password } = req.body as ILogin;

    try {
      const jwt = await validateUser(email, password);
      Logger.info(`User login successful: ${email}`);
      res.json({ token: jwt });
    } catch (error) {
      const loginAttemptData = new LoginAttempt({
        email,
        status: "failed",
      });
      await loginAttemptData.save();
      console.warn(`User login failed for: ${email}`);
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    console.error(
      `Error processing login request: ${(error as Error).message}`
    );
    next(error);
  }
});

export { router as usersRouter };
