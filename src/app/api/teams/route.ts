import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-config"
import { TeamService } from "@/lib/services/team-service"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const teams = await TeamService.getUserTeams(session.user.id)
    return NextResponse.json(teams)
  } catch (error) {
    console.error("[TEAMS_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { name } = await req.json()
    const team = await TeamService.createTeam({
      name,
      ownerId: session.user.id,
    })

    return NextResponse.json(team)
  } catch (error) {
    console.error("[TEAMS_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}