import { User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prismaClient";

prisma;

type Data = {
  user: User;
};
type Message = {
  msg: String;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Message>
) {
  try {
    const { id, email, user_metadata } = req.body;
    if (!id) {
      res.status(500).json({ msg: "bad signup" });
    } else {
      const newUser: User = await prisma.user.create({
        data: {
          id: id,
          name: user_metadata.name,
          email: email,
          image: " ",
          currentBalance: 0,
        },
      });
      res.status(200).json({ msg: "user created", user: newUser });
    }
  } catch (error) {
    console.log(error);
  }
}
