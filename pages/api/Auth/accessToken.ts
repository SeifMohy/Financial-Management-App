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
    const { accessToken, userId, itemId } = req.body;
    console.log({ accessToken, userId, itemId });
    if (!accessToken) {
      res.status(500).json({ msg: "no token" });
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      res.status(500).json({ msg: "no user" });
    } else {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { accessToken: accessToken, itemId: itemId },
      });
      console.log("updated user successfully", updatedUser);

      const items = await prisma.userItems.create({
        data: {
          itemId,
          accessToken,
          userId,
        },
      });
      console.log({ items });
      res.status(200).json({ msg: "accessToken Updated", user: updatedUser });
    }
  } catch (error) {
    console.log({ error });
    res.status(400).json({ msg: "there is an error" });
  }
}
