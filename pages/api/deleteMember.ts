// pages/api/deleteMember.ts
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const { id } = req.body;
  await prisma.member.delete({ where: { id } });
  res.status(200).json({ success: true });
}
