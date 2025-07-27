import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireAdmin, AuthenticatedRequest } from '@/lib/auth-middleware';
import { prisma } from '@/lib/prisma';

async function getHandler(
  request: AuthenticatedRequest,
  { params }: { params: Promise<{ questionId: string }> }
) {
  try {
    const { questionId } = await params;

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: {
        lecture: {
          select: {
            id: true,
            title: true,
            specialty: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(question);
  } catch (error) {
    console.error('Error fetching question:', error);
    return NextResponse.json(
      { error: 'Failed to fetch question' },
      { status: 500 }
    );
  }
}

async function putHandler(
  request: AuthenticatedRequest,
  { params }: { params: Promise<{ questionId: string }> }
) {
  try {
    const { questionId } = await params;
    const {
      type,
      text,
      options,
      correctAnswers,
      explanation,
      courseReminder,
      number,
      session,
      mediaUrl,
      mediaType
    } = await request.json();

    const question = await prisma.question.update({
      where: { id: questionId },
      data: {
        type,
        text,
        options,
        correctAnswers,
        explanation,
        courseReminder,
        number,
        session,
        mediaUrl,
        mediaType
      },
      include: {
        lecture: {
          select: {
            id: true,
            title: true,
            specialty: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(question);
  } catch (error) {
    console.error('Error updating question:', error);
    return NextResponse.json(
      { error: 'Failed to update question' },
      { status: 500 }
    );
  }
}

async function deleteHandler(
  request: AuthenticatedRequest,
  { params }: { params: Promise<{ questionId: string }> }
) {
  try {
    const { questionId } = await params;

    await prisma.question.delete({
      where: { id: questionId }
    });

    return NextResponse.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    return NextResponse.json(
      { error: 'Failed to delete question' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(getHandler);
export const PUT = requireAdmin(putHandler);
export const DELETE = requireAdmin(deleteHandler); 