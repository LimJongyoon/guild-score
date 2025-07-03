// pages/api/getMemberById.ts
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const member = await prisma.member.findUnique({ where: { id: id as string } });

  if (!member) return res.status(404).json({ error: "Not found" });

  res.status(200).json(member);
}
