import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireAdmin, AuthenticatedRequest } from '@/lib/auth-middleware';
import { prisma } from '@/lib/prisma';

async function getHandler(request: AuthenticatedRequest) {
  try {
    const userId = request.user!.userId;

    // Get all specialties with their lectures and questions
    const specialties = await prisma.specialty.findMany({
      include: {
        lectures: {
          include: {
            questions: true,
            progress: {
              where: {
                userId: userId,
                questionId: null // Only lecture-level progress
              }
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    // Calculate progress for each specialty
    const specialtiesWithProgress = specialties.map(specialty => {
      const totalLectures = specialty.lectures.length;
      const completedLectures = specialty.lectures.filter(lecture => 
        lecture.progress.length > 0 && lecture.progress[0].completed
      ).length;
      
      const totalQuestions = specialty.lectures.reduce((sum, lecture) => 
        sum + lecture.questions.length, 0
      );
      
      const completedQuestions = specialty.lectures.reduce((sum, lecture) => {
        const lectureProgress = lecture.progress[0];
        if (lectureProgress && lectureProgress.completed) {
          return sum + lecture.questions.length;
        }
        return sum;
      }, 0);

      return {
        ...specialty,
        progress: {
          totalLectures,
          completedLectures,
          totalQuestions,
          completedQuestions,
          lectureProgress: totalLectures > 0 ? completedLectures / totalLectures * 100 : 0,
          questionProgress: totalQuestions > 0 ? completedQuestions / totalQuestions * 100 : 0
        }
      };
    });

    return NextResponse.json(specialtiesWithProgress);
  } catch (error) {
    console.error('Error fetching specialties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch specialties' },
      { status: 500 }
    );
  }
}

async function postHandler(request: AuthenticatedRequest) {
  try {
    const { name, description } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const specialty = await prisma.specialty.create({
      data: {
        name,
        description
      }
    });

    return NextResponse.json(specialty);
  } catch (error) {
    console.error('Error creating specialty:', error);
    return NextResponse.json(
      { error: 'Failed to create specialty' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(getHandler);
export const POST = requireAdmin(postHandler); 