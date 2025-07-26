import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, AuthenticatedRequest } from '@/lib/auth-middleware';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const authenticatedRequest = await authenticateRequest(request);
    
    if (!authenticatedRequest) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { lectureId, questionId, completed, score } = await request.json();
    const userId = authenticatedRequest.user!.userId;

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

export async function GET(request: NextRequest) {
  try {
    const authenticatedRequest = await authenticateRequest(request);
    
    if (!authenticatedRequest) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const lectureId = searchParams.get('lectureId');
    const specialtyId = searchParams.get('specialtyId');
    const userId = authenticatedRequest.user!.userId;

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