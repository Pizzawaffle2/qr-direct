import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SettingsSchema } from "@/lib/validations/settings";
import { Settings } from "@prisma/client";
import { z } from "zod";

// Custom error class for better error handling
class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

// Types for better type safety
interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Service layer function to handle settings updates
async function updateUserSettings(
  userId: string,
  data: z.infer<typeof SettingsSchema>
): Promise<Settings> {
  return prisma.settings.upsert({
    where: { userId },
    update: {
      name: data.name
    },
    create: {
      userId,
      name: data.name
    },
  });
}

// Middleware for authentication and user ID extraction
async function authenticateRequest(): Promise<string> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new ApiError(401, "Unauthorized");
  }

  return session.user.id;
}

// PUT handler to update user settings
export async function PUT(req: Request): Promise<NextResponse<ApiResponse<Settings>>> {
  try {
    // Authenticate and get the user ID
    const userId = await authenticateRequest();

    // Parse and validate request body
    const body = await req.json();
    const validatedData = SettingsSchema.parse(body);

    // Update settings in the database
    const settings = await updateUserSettings(userId, validatedData);

    // Return the updated settings
    return NextResponse.json({ data: settings }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      return NextResponse.json(
        {
          error: "Validation Error",
          details: error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    if (error instanceof ApiError) {
      // Handle custom API errors
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    // Log unexpected errors and return a generic response
    console.error("[Settings API Error]:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
