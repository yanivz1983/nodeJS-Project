// initDB.ts
import { joiCardSchema } from "../joi/card.joi";
import { Logger } from "../logs/logger";
import { isAdmin } from "../middleware/is-admin";
import { User } from "./model/user";
import { users } from "./users";

const initDB = async () => {
  try {
    await isAdmin({ user: { isAdmin: true } } as any, {} as any, () => {});

    const usersCount = await User.countDocuments();
    if (usersCount !== 0) return;

    for (let user of users) {
      const saved = await new User(user).save();
      Logger.verbose("Added user: ", saved);
    }

    const cards = [
      {
        title: "Card 1",
        subtitle: "Subtitle 1",
        description: "Description for Card 1",
        price: "19.99$",
        shipping: "Worldwide",
        image: {
          url: "https://example.com/card1.jpg",
          alt: "Card 1 Image",
        },
      },
      {
        title: "Card 2",
        subtitle: "Subtitle 2",
        description: "Description for Card 2",
        price: "29.99$",
        shipping: "Europe",
        image: {
          url: "https://example.com/card2.jpg",
          alt: "Card 2 Image",
        },
      },
      {
        title: "Card 3",
        subtitle: "Subtitle 3",
        description: "Description for Card 3",
        price: "39.99$",
        shipping: "North America",
        image: {
          url: "https://example.com/card3.jpg",
          alt: "Card 3 Image",
        },
      },
    ];

    cards.forEach((card, index) => {
      const { error, value } = joiCardSchema.validate(card);

      if (error) {
        console.error(`Validation Error for Card ${index + 1}:`, error.details);
      } else {
        console.log(`Card ${index + 1} is valid:`, value);
      }
    });
  } catch (error) {
    console.error("Error during initialization:", error);
  }
};

export { initDB };
