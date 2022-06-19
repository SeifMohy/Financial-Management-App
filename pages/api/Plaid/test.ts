import { getUser } from "@supabase/supabase-auth-helpers/nextjs";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ) {
    const { user } = await getUser({ req, res });
    console.log(user);
  }
  