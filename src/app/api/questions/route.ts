import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireAdmin, AuthenticatedRequest } from '@/lib/auth-middleware';
import { prisma } from '@/lib/prisma';

async function getHandler(request: AuthenticatedRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lectureId = searchParams.get('lectureId');
    const type = searchParams.get('type');

    const where: any = {};
    if (lectureId) where.lectureId = lectureId;
    if (type) where.type = type;

    const questions = await prisma.question.findMany({
      where,
      orderBy: [
        { type: 'asc' },
        { number: 'asc' },
        { id: 'asc' }
      ],
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
    
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}

async function postHandler(request: AuthenticatedRequest) {
  try {
    const {
      lectureId,
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

    if (!lectureId || !type || !text) {
      return NextResponse.json(
        { error: 'lectureId, type, and text are required' },
        { status: 400 }
      );
    }

    const question = await prisma.question.create({
      data: {
        lectureId,
        type,
        text,
        options,
        correctAnswers: correctAnswers || [],
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

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json(
      { error: 'Failed to create question' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(getHandler);
export const POST = requireAdmin(postHandler); 