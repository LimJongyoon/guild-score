// pages/api/getMembers.ts
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  try {
    const members = await prisma.member.findMany({ orderBy: { number: "asc" } });
    res.status(200).json(members);
  } catch (err) {
    console.error("🔥 getMembers error:", err); // ← 터미널 로그로 찍힘
    res.status(500).json({ error: "서버 오류 발생" });
  }
}
