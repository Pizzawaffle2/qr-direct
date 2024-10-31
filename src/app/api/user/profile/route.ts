import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import bcrypt from "bcryptjs"

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const data = await req.json()
    const { name, currentPassword, newPassword } = data

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    })

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password as string
    )

    if (!isValidPassword) {
      return new NextResponse("Invalid current password", { status: 400 })
    }

    // Update user data
    const updateData: any = { name }

    // Update password if provided
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 12)
      updateData.password = hashedPassword
    }

    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    })

    return NextResponse.json({ user: updatedUser })
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 })
  }
}