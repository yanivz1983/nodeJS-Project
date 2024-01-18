import { hash } from "bcrypt";

const hashCardDetails = async (data: string): Promise<string> => {
  try {
    const hashedData = await hash(data, 10); // You can adjust the salt rounds

    return hashedData;
  } catch (error) {
    throw new Error(`Error hashing card details: ${(error as Error).message}`);
  }
};

export { hashCardDetails };
