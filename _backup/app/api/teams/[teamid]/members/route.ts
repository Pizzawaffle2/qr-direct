import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-config"
import { TeamService } from "@/lib/services/team-service"
import { TeamRole } from "@prisma/client"

export async function POST(
  req: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { email, role } = await req.json()
    
    const invitation = await TeamService.inviteMember({
      email,
      role: role as TeamRole,
      teamId: params.teamId,
      invitedBy: session.user.id,
    })

    return NextResponse.json(invitation)
  } catch (error) {
    console.error("[TEAM_MEMBERS_POST]", error)
    return new NextResponse(
      error instanceof Error ? error.message : "Internal error",
      { status: 500 }
    )
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { memberId, role } = await req.json()
    
    const member = await TeamService.updateMemberRole(
      params.teamId,
      memberId,
      role as TeamRole,
      session.user.id
    )

    return NextResponse.json(member)
  } catch (error) {
    console.error("[TEAM_MEMBERS_PUT]", error)
    return new NextResponse(
      error instanceof Error ? error.message : "Internal error",
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const memberId = searchParams.get("memberId")

    if (!memberId) {
      return new NextResponse("Member ID is required", { status: 400 })
    }

    await TeamService.removeMember(
      params.teamId,
      memberId,
      session.user.id
    )

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[TEAM_MEMBERS_DELETE]", error)
    return new NextResponse(
      error instanceof Error ? error.message : "Internal error",
      { status: 500 }
    )
  }
}