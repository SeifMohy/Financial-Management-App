import { User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { APIUser } from "../../../Types/index";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<APIUser>
) {
  try {
    const userId = req.query;
    if (Object.values(userId).length > 2) {
      console.log("loading");
    }
    const id = Object.values(userId)[0];
    const user = await prisma.user.findUnique({
      where: {
        id: id as string,
      },
    });
    res.status(200).json({ user: user });
  } catch (error) {
    console.log(error);
  }
}
