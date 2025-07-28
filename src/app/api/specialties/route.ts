import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireAdmin, AuthenticatedRequest } from '@/lib/auth-middleware';
import { prisma } from '@/lib/prisma';

async function getHandler(request: AuthenticatedRequest) {
  try {
    const userId = request.user!.userId;

    // Use aggregation queries for better performance
    const specialtiesWithStats = await prisma.specialty.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        imageUrl: true,
        createdAt: true,
        _count: {
          select: {
            lectures: true
          }
        },
        lectures: {
          select: {
            id: true,
            _count: {
              select: {
                questions: true
              }
            },
            progress: {
              where: {
                userId: userId,
                questionId: null // Only lecture-level progress
              },
              select: {
                completed: true
              }
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    // Get user progress for questions across all specialties in a single query
    const userQuestionProgress = await prisma.userProgress.groupBy({
      by: ['lectureId'],
      where: {
        userId: userId,
        questionId: {
          not: null
        }
      },
      _count: {
        questionId: true
      },
      _sum: {
        score: true
      }
    });

    // Create a map for quick lookup
    const progressMap = new Map(
      userQuestionProgress.map(p => [p.lectureId, { count: p._count.questionId, score: p._sum.score }])
    );

    // Calculate progress for each specialty
    const specialtiesWithProgress = specialtiesWithStats.map(specialty => {
      let totalQuestions = 0;
      let completedLectures = 0;
      let completedQuestions = 0;
      let totalScore = 0;

      specialty.lectures.forEach(lecture => {
        totalQuestions += lecture._count.questions;
        
        // Check if lecture is completed
        if (lecture.progress.length > 0 && lecture.progress[0].completed) {
          completedLectures++;
          completedQuestions += lecture._count.questions;
        }

        // Add question-level progress
        const questionProgress = progressMap.get(lecture.id);
        if (questionProgress) {
          completedQuestions += questionProgress.count;
          totalScore += questionProgress.score || 0;
        }
      });

      const totalLectures = specialty._count.lectures;
      const lectureProgress = totalLectures > 0 ? completedLectures / totalLectures * 100 : 0;
      const questionProgress = totalQuestions > 0 ? completedQuestions / totalQuestions * 100 : 0;

      return {
        id: specialty.id,
        name: specialty.name,
        description: specialty.description,
        imageUrl: specialty.imageUrl,
        createdAt: specialty.createdAt,
        progress: {
          totalLectures,
          completedLectures,
          totalQuestions,
          completedQuestions,
          lectureProgress,
          questionProgress,
          averageScore: completedQuestions > 0 ? totalScore / completedQuestions : 0
        }
      };
    });

    const response = NextResponse.json(specialtiesWithProgress);
    
    // Add caching headers for better performance
    response.headers.set('Cache-Control', 'private, max-age=300'); // 5 minutes
    response.headers.set('ETag', `"${Date.now()}"`);
    
    return response;
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