import mongoose from "mongoose";
import { cardSchema } from "../schema/card-schema";


const Cards = mongoose.model("cards", cardSchema);

export { Cards };
