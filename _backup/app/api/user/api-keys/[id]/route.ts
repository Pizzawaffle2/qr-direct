// File: src/app/api/user/api-keys/[id]/route.ts
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response('Unauthorized', { status: 401 });

  try {
    await prisma.apiKey.deleteMany({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });
    return NextResponse.json({ message: 'API key deleted' });
  } catch (error) {
    return new Response('Failed to delete API key', { status: 500 });
  }
}
