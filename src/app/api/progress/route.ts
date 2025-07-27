import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, AuthenticatedRequest } from '@/lib/auth-middleware';
import { prisma } from '@/lib/prisma';

async function postHandler(request: AuthenticatedRequest) {
  try {
    const { lectureId, questionId, completed, score } = await request.json();
    const userId = request.user!.userId;

    if (!lectureId) {
      return NextResponse.json(
        { error: 'Lecture ID is required' },
        { status: 400 }
      );
    }

    // Upsert progress record
    const progress = await prisma.userProgress.upsert({
      where: {
        userId_lectureId_questionId: {
          userId,
          lectureId,
          questionId: questionId || null
        }
      },
      update: {
        completed: completed ?? true,
        score: score,
        lastAccessed: new Date()
      },
      create: {
        userId,
        lectureId,
        questionId: questionId || null,
        completed: completed ?? true,
        score: score,
        lastAccessed: new Date()
      }
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}

async function getHandler(request: AuthenticatedRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lectureId = searchParams.get('lectureId');
    const specialtyId = searchParams.get('specialtyId');
    const userId = request.user!.userId;

    let whereClause: any = { userId };

    if (lectureId) {
      whereClause.lectureId = lectureId;
    }

    if (specialtyId) {
      // Get all lectures for this specialty
      const lectures = await prisma.lecture.findMany({
        where: { specialtyId },
        select: { id: true }
      });
      whereClause.lectureId = { in: lectures.map(l => l.id) };
    }

    const progress = await prisma.userProgress.findMany({
      where: whereClause,
      include: {
        lecture: {
          select: {
            id: true,
            title: true,
            specialtyId: true
          }
        }
      }
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}

export const POST = requireAuth(postHandler);
export const GET = requireAuth(getHandler); 