import { Router } from "express";
import { isBusiness } from "../middleware/is-business";
import { isAdmin } from "../middleware/is-admin";
import { validateCard } from "../middleware/validation";
import { createCard } from "../service/card-service";
import { ICardInput } from "../@types/card";
import { BizCardsError } from "../error/biz-cards-error";
import { Card } from "../database/model/Card";
import { Logger } from "../logs/logger";
import { validateToken } from "../middleware/validate-token";
import { User } from "../database/model/user";

const router = Router();

router.post("/", isBusiness, isAdmin, validateCard, async (req, res, next) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      throw new BizCardsError("User must have an ID", 500);
    }

    const savedCard = await createCard(req.body as ICardInput, userId);

    res.json({ card: savedCard });
  } catch (e) {
    next(e);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const cards = await Card.find();
    return res.json(cards);
  } catch (e) {
    next(e);
  }
});

router.get("/my-cards", isBusiness, isAdmin, async (req, res, next) => {
  try {
    const userId = req.user?._id;

    console.log("User ID:", userId);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const cards = await Card.find({ userId });

    console.log("User Cards:", cards);

    return res.json(cards);
  } catch (e) {
    console.error("Error fetching user cards:", e);
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const card = await Card.findById(id);
    return res.json(card);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", isBusiness, isAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const card = await Card.findById(id);

    if (!card) {
      console.error("Card not found:", id);
      return res.status(404).json({ message: "Card not found" });
    }

    if (card.userId?.toString() !== req.user?._id?.toString()) {
      Logger.warn(
        `User ${req.user?._id} tried to delete a card they did not create`
      );
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this card" });
    }

    const deletedCard = await Card.findByIdAndDelete(id);
    if (!deletedCard) {
      return res.status(404).json({ message: "Card not found" });
    }

    Logger.verbose(`Card deleted successfully: ${id}`);
    res.json({ message: "Card deleted successfully", deletedCard });
  } catch (error) {
    console.error(`Error deleting card: ${(error as Error).message}`);
    next(error);
  }
});

router.put("/:id", isAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const card = await Card.findById(id);

    if (!card) {
      console.error("Card not found:", id);
      return res.status(404).json({ message: "Card not found" });
    }
    card.set(req.body);
    const updatedCard = await card.save();
    Logger.verbose(`Card updated successfully: ${id}`);
    res.json(updatedCard);
  } catch (error) {
    console.error(`Error updating card: ${(error as Error).message}`);
    next(error);
  }
});

router.patch("/:id", validateToken, async (req, res, next) => {
  try {
    const cardId = req.params.id;
    const userId = req.user?._id!;

    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }
    card.likes = card.likes || [];
    if (userId) {
      if (card.likes.includes(userId)) {
        card.likes = card.likes.filter((id) => id != userId && id != null);
        await card.save();
        return res.status(200).json({
          message: `Card ${cardId} un-liked by the user`,
          card,
        });
      }
    }
    card.likes.push(userId);
    await card.save();

    return res.status(200).json({
      message: `Card ${cardId} liked by the user`,
      card,
    });
  } catch (error) {
    Logger.error(`Error updating card: ${(error as Error).message}`);
    next(error);
  }
});

router.patch("/:id/add-to-cart", validateToken, async (req, res, next) => {
  try {
    const cardId = req.params.id;
    const userId = req.user?._id!;

    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    card.addToCart = card.addToCart || [];

    if (card.addToCart.includes(userId)) {
      return res.status(200).json({
        message: `Card ${cardId} is already in the user's cart`,
        card,
      });
    }

    card.addToCart.push(userId);
    await card.save();

    return res.status(200).json({
      message: `Card ${cardId} added to the user's cart`,
      card,
    });
  } catch (error) {
    console.error(`Error updating card: ${(error as Error).message}`);
    next(error);
  }
});

export { router as cardsRouter };
