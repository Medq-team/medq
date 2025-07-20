import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lectureId: string }> }
) {
  try {
    const { lectureId } = await params;

    const lecture = await prisma.lecture.findUnique({
      where: { id: lectureId },
      include: {
        specialty: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            questions: true
          }
        }
      }
    });

    if (!lecture) {
      return NextResponse.json(
        { error: 'Lecture not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(lecture);
  } catch (error) {
    console.error('Error fetching lecture:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lecture' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ lectureId: string }> }
) {
  try {
    const { lectureId } = await params;
    const { title, description, specialtyId } = await request.json();

    const lecture = await prisma.lecture.update({
      where: { id: lectureId },
      data: {
        title,
        description,
        specialtyId
      },
      include: {
        specialty: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return NextResponse.json(lecture);
  } catch (error) {
    console.error('Error updating lecture:', error);
    return NextResponse.json(
      { error: 'Failed to update lecture' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ lectureId: string }> }
) {
  try {
    const { lectureId } = await params;

    await prisma.lecture.delete({
      where: { id: lectureId }
    });

    return NextResponse.json({ message: 'Lecture deleted successfully' });
  } catch (error) {
    console.error('Error deleting lecture:', error);
    return NextResponse.json(
      { error: 'Failed to delete lecture' },
      { status: 500 }
    );
  }
} 