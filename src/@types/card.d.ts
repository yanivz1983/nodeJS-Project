export type ICardInput = {
  title: string;
  subtitle: string;
  description: string;
  price: string;
  shipping: string;
  address: IAddress;
  image: Image;
};

export type ICard = ICardInput & {
  bizNumber?: number;
  userId?: string;
  quantity: number;
  _id?: string;
  likes: string[];
  addToCart: string[];
  createdAt: Date;
};
