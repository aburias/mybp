import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request, { params }) {
  try {
    // Next.js 15 requires awaiting params
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json({ error: 'Reading ID is required' }, { status: 400 });
    }

    await prisma.reading.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: 'Reading deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting reading:', error);
    return NextResponse.json({ error: 'Failed to delete reading.' }, { status: 500 });
  }
}
