import { User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

type APIUser = {
    accessToken: string | null | undefined;
};

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
    res.status(200).json({ accessToken: user?.accessToken });
  } catch (error) {
    console.log(error);
  }
}
