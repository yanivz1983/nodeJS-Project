import Joi from "joi";
import { ICard } from "../@types/card";
import { IImage } from "../@types/user";

const schema = Joi.object<ICard>({
  title: Joi.string().min(1).max(100).required(),
  subtitle: Joi.string().min(1).max(100).required(),
  description: Joi.string().min(1).max(500).required(),
  price: Joi.string().min(4).max(6).required(),
  // quantity: Joi.number().min(1).max(50).required(),
  shipping: Joi.string().min(4).max(6).required(),
  image: Joi.object<IImage>({
    url: Joi.string().uri().min(5).max(255),
    alt: Joi.string().min(1).max(100),
  }),
});

export default schema;
export { schema as joiCardSchema };
