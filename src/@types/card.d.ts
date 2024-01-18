export type ICardInput = {
  title: string;
  subtitle: string;
  description: string;
  price: string;
  // quantity: number;
  shipping: string;
  address: IAddress;
  image: Image;
};

export type ICard = ICardInput & {
  bizNumber?: number;
  userId?: string;
  _id?: string;
  likes: string[];
  addToCart: string[];
  createdAt: Date;
};
