// pages/api/uploadImage.ts
import { IncomingForm, File, Files, Fields } from "formidable";
import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const uploadDir = path.join(process.cwd(), "public/uploads");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = new IncomingForm({
    uploadDir,               // ✅ 이렇게 설정
    keepExtensions: true,    // ✅ 옵션 안에서 설정
  });

  form.parse(req, async (err: any, fields: Fields, files: Files) => {
    if (err) return res.status(500).json({ error: "Upload failed" });

    const file = files.file?.[0] as File;
    const id = fields.id?.[0] as string;

    const filename = `${id}-${Date.now()}.${file.originalFilename?.split(".").pop()}`;
    const destPath = path.join(uploadDir, filename);
    fs.renameSync(file.filepath, destPath);

    const imageUrl = `/uploads/${filename}`;
    const { prisma } = await import("@/lib/prisma");

    await prisma.member.update({
      where: { id },
      data: { imageUrl },
    });

    res.status(200).json({ imageUrl });
  });
}
