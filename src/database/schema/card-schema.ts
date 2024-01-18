import { ICard } from "../../@types/card";
import { Schema } from "mongoose";
import { imageSchema } from "./image-schema";

const cardSchema = new Schema<ICard>({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  // quantity: { type: Number, required: true },
  shipping: { type: String, required: true },
  image: { type: imageSchema },
  userId: { type: String, required: true },
  bizNumber: {
    type: Number,
    required: false,
    default: () => Math.round(Math.random() * 1_000_000),
    unique: true,
  },
  createdAt: {
    type: Date,
    required: false,
    default: new Date(),
  },
  likes: [
    {
      type: String,
    },
  ],
  addToCart: [
    {
      type: String,
    },
  ],
});

export { cardSchema };
