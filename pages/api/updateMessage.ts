// pages/api/updateMessage.ts
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, message } = req.body;

  const updated = await prisma.member.update({
    where: { id },
    data: { message },
  });

  res.status(200).json(updated);
}
