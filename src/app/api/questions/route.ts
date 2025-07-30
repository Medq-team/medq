import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireAdmin, AuthenticatedRequest } from '@/lib/auth-middleware';
import { prisma } from '@/lib/prisma';

async function getHandler(request: AuthenticatedRequest) {
  try {
    const userId = request.user!.userId;
    const { searchParams } = new URL(request.url);
    const lectureId = searchParams.get('lectureId');
    const type = searchParams.get('type');

    // Get user with their niveau information
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        id: true, 
        role: true, 
        niveauId: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const where: any = {};
    if (lectureId) where.lectureId = lectureId;
    if (type) where.type = type;

    // If user is not admin and has a niveau, filter by specialty niveau
    if (user.role !== 'admin' && user.niveauId) {
      where.lecture = {
        specialty: {
          niveauId: user.niveauId
        }
      };
    }

    const questions = await prisma.question.findMany({
      where,
      orderBy: [
        { type: 'asc' },
        { number: 'asc' },
        { id: 'asc' }
      ],
      select: {
        id: true,
        lectureId: true,
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
        createdAt: true,
        lecture: {
          select: {
            id: true,
            title: true,
            specialty: {
              select: {
                id: true,
                name: true,
                niveauId: true,
                niveau: {
                  select: {
                    id: true,
                    name: true
                  }
                }
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
      mediaType,
      caseNumber,
      caseText,
      caseQuestionNumber
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
        mediaType,
        caseNumber,
        caseText,
        caseQuestionNumber
      },
      select: {
        id: true,
        lectureId: true,
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
        createdAt: true,
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

    // Note: Cache invalidation is handled by the client-side hook
    // The useLecture hook will clear its cache when isAddQuestionOpen changes

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