import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireAdmin, AuthenticatedRequest } from '@/lib/auth-middleware';
import { prisma } from '@/lib/prisma';

async function getHandler(
  request: AuthenticatedRequest,
  { params }: { params: Promise<{ lectureId: string }> }
) {
  try {
    const { lectureId } = await params;
    const { searchParams } = new URL(request.url);
    const includeQuestions = searchParams.get('includeQuestions') === 'true';

    if (includeQuestions) {
      // Optimized query: fetch lecture with questions in a single request
      const lectureWithQuestions = await prisma.lecture.findUnique({
        where: { id: lectureId },
        include: {
          specialty: {
            select: {
              id: true,
              name: true
            }
          },
          questions: {
            orderBy: [
              { type: 'asc' },
              { number: 'asc' },
              { id: 'asc' }
            ],
            select: {
              id: true,
              type: true,
              text: true,
              options: true,
              correctAnswers: true,
              explanation: true,
              courseReminder: true,
              number: true,
              session: true,
              mediaUrl: true,
              mediaType: true,
              caseNumber: true,
              caseText: true,
              caseQuestionNumber: true,
              createdAt: true
            }
          },
          _count: {
            select: {
              questions: true
            }
          }
        }
      });

      if (!lectureWithQuestions) {
        return NextResponse.json(
          { error: 'Lecture not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(lectureWithQuestions);
    } else {
      // Original query: fetch lecture only
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
    }
  } catch (error) {
    console.error('Error fetching lecture:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lecture' },
      { status: 500 }
    );
  }
}

async function putHandler(
  request: AuthenticatedRequest,
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

async function deleteHandler(
  request: AuthenticatedRequest,
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

export const GET = requireAuth(getHandler);
export const PUT = requireAdmin(putHandler);
export const DELETE = requireAdmin(deleteHandler); 