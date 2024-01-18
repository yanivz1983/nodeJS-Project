import { Schema } from "mongoose";
import { imageSchema } from "../database/schema/image-schema";
import { ICard } from "../@types/card";

const cardSchema = new Schema<ICard>({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  // quantity: {type:Number,required: true}
  shipping: { type: String, required: true },
  image: { type: imageSchema, required: false },
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
});

export { cardSchema as joiCardSchema };
