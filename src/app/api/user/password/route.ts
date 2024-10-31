// File: src/app/api/user/password/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function PUT(req: Request) {
 const session = await getServerSession(authOptions)
 if (!session?.user?.id) return new Response("Unauthorized", { status: 401 })

 try {
   const { currentPassword, newPassword } = await req.json()
   
   const user = await prisma.user.findUnique({
     where: { id: session.user.id }
   })

   const isValid = await bcrypt.compare(currentPassword, user.password)
   if (!isValid) return new Response("Invalid current password", { status: 400 })

   const hashedPassword = await bcrypt.hash(newPassword, 12)
   await prisma.user.update({
     where: { id: session.user.id },
     data: { password: hashedPassword },
   })

   return NextResponse.json({ message: "Password updated" })
 } catch (error) {
   return new Response("Failed to update password", { status: 500 })
 }
}