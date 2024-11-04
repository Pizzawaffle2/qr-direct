// File: src/app/api/user/settings/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { settingsSchema } from "@/lib/validations/settings";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const body = settingsSchema.parse(json);

    const settings = await prisma.settings.upsert({
      where: {
        userId: session.user.id,
      },
      update: body,
      create: {
        ...body,
        userId: session.user.id,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Settings update error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}