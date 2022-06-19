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
    const { accessToken, userId } = req.body;
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
        data: { accessToken: accessToken },
      });
      res.status(200).json({ msg: "accessToken Updated", user: updatedUser });
    }
  } catch (error) {
    console.log(error);
  }
}
