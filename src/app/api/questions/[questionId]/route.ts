import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
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

export async function PUT(
  request: NextRequest,
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

export async function DELETE(
  request: NextRequest,
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