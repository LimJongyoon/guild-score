// pages/api/addMember.ts
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { number, name, job, message } = req.body;
    const newMember = await prisma.member.create({
      data: {
        number: parseInt(number),
        name,
        job,
        message,
      },
    });
    res.json(newMember);
  }
}
