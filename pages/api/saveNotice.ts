// 공지사항 저장 API
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { text } = req.body;
  const result = await prisma.notice.upsert({
    where: { id: "main" },
    update: { text },
    create: { id: "main", text },
  });

  res.status(200).json(result);
}
