// pages/api/updateStats.ts
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, hp, mp } = req.body;

  const updated = await prisma.member.update({
    where: { id },
    data: {
      hp: parseInt(hp),
      mp: parseInt(mp),
    },
  });

  res.status(200).json(updated);
}
