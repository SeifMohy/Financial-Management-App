import { Transaction, User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prismaClient";

prisma;

type Data = {
  sender: { transaction: Transaction; balance: User };
  receiver: { transaction: Transaction; balance: User };
};

type Message = {
  msg: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Message>
) {
  try {
    const userId = req.query;
    const transaction = req.body;
    console.log(userId);
    console.log(transaction);
    if (Object.values(userId)[0].length < 10) {
      console.log("loading");
    } else {
      const senderId = Object.values(userId)[0];
      const receiver = await prisma.user.findUnique({
        where: { email: transaction.email },
      });
      const sender = await prisma.user.findUnique({
        where: { id: senderId as string },
      });
      if (!receiver || !sender) {
        return res.status(404).json({ msg: "incorect user" });
      }
      const receiverId = receiver?.id;
      const senderCategory = await prisma.category.findFirst({
        where: { category: transaction.category },
      });

      const senderTransaction = await prisma.transaction.create({
        data: {
          date: new Date().toLocaleDateString("en-CA"),
          amount: -parseFloat(transaction.amount),
          userId: senderId as string,
          description: transaction.description,
          categoryId: senderCategory?.id,
        },
      });
      const receiverTransaction = await prisma.transaction.create({
        data: {
          date: new Date().toLocaleDateString("en-CA"),
          amount: parseFloat(transaction.amount),
          userId: receiverId as string,
          description: transaction.description,
          categoryId: "1",
        },
      });
      const updateSender = await prisma.user.update({
        where: {
          id: senderId as string,
        },
        data: {
          currentBalance: sender?.currentBalance
            ? sender?.currentBalance - parseFloat(transaction.amount)
            : -parseFloat(transaction.amount),
        },
      });
      const updateReceiver = await prisma.user.update({
        where: {
          id: receiverId as string,
        },
        data: {
          currentBalance: receiver?.currentBalance
            ? receiver?.currentBalance + parseFloat(transaction.amount)
            : parseFloat(transaction.amount),
        },
      });
      res.json({
        sender: { transaction: senderTransaction, balance: updateSender },
        receiver: { transaction: receiverTransaction, balance: updateReceiver },
      });
    }
  } catch (error) {
    res.json({ msg: "error" });
    console.log(error);
  }
}
