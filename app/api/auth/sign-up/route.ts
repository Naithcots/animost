import db from "@/lib/db";
import { UserAccountType } from "@prisma/client";
import bcrypt from "bcrypt";
import z from "zod";

export async function POST(req: Request) {
  const bodySchema = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string(),
  });

  const body = await req.json();

  try {
    const response = bodySchema.safeParse(body);

    if (!response.success) {
      return new Response(null, { status: 400 });
    }

    const {
      data: { email, password, username },
    } = response;

    const user = await db.user.findUnique({ where: { email } });

    if (user) {
      return new Response(null, { status: 403 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        type: UserAccountType.CREDENTIALS,
      },
    });

    return new Response(null, { status: 201 });
  } catch (error: any) {
    return new Response(null, { status: 500 });
  }
}
