import { Schema } from "mongoose";
import { IImage } from "../../@types/user";

const imageSchema = new Schema<IImage>({
  alt: {
    type: String,
    maxlength: 200,
  },
  url: {
    type: String,
    maxlength: 200,
  },
});

export { imageSchema };
