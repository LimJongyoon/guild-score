// 공지사항 불러오기 API
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  const notice = await prisma.notice.findUnique({ where: { id: "main" } });
  res.status(200).json(notice?.text || "");
}
