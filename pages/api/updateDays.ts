// pages/api/updateDays.ts
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, days } = req.body;

  const updated = await prisma.member.update({
    where: { id },
    data: { days },
  });

  res.status(200).json(updated);
}
