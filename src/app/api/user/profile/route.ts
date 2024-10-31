// File: src/app/api/user/profile/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(req: Request) {
 const session = await getServerSession(authOptions)
 if (!session?.user?.id) return new Response("Unauthorized", { status: 401 })

 try {
   const data = await req.json()
   const user = await prisma.user.update({
     where: { id: session.user.id },
     data: {
       name: data.name,
       bio: data.bio,
       image: data.avatar,
     },
   })
   return NextResponse.json(user)
 } catch (error) {
   return new Response("Failed to update profile", { status: 500 })
 }
}