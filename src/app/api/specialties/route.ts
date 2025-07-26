import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, requireAdmin, AuthenticatedRequest } from '@/lib/auth-middleware';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const authenticatedRequest = await authenticateRequest(request);
    const userId = authenticatedRequest?.user?.userId;

    // Get all specialties with their lectures and questions
    const specialties = await prisma.specialty.findMany({
      include: {
        lectures: {
          include: {
            questions: true,
            progress: userId ? {
              where: {
                userId: userId,
                questionId: null // Only lecture-level progress
              }
            } : false
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    // Calculate progress for each specialty if user is authenticated
    const specialtiesWithProgress = await Promise.all(
      specialties.map(async (specialty) => {
        const totalLectures = specialty.lectures.length;
        const totalQuestions = specialty.lectures.reduce((sum, lecture) => sum + lecture.questions.length, 0);
        
        let completedLectures = 0;
        let completedQuestions = 0;
        let correctQuestions = 0;
        let incorrectQuestions = 0;
        let partialQuestions = 0;

        if (userId) {
          // Count completed lectures
          completedLectures = specialty.lectures.filter(lecture => 
            lecture.progress && lecture.progress.length > 0 && lecture.progress[0].completed
          ).length;

          // Get detailed progress for this specialty
          const progressResult = await prisma.userProgress.findMany({
            where: {
              userId,
              questionId: { not: null },
              lecture: {
                specialtyId: specialty.id
              }
            },
            select: {
              completed: true,
              score: true
            }
          });

          completedQuestions = progressResult.length;
          
          // Categorize questions based on score
          progressResult.forEach(progress => {
            if (progress.completed) {
              if (progress.score === 1) {
                correctQuestions++;
              } else if (progress.score === 0) {
                incorrectQuestions++;
              } else if (progress.score && progress.score > 0 && progress.score < 1) {
                partialQuestions++;
              } else {
                // If no score but completed, count as incorrect
                incorrectQuestions++;
              }
            }
          });
        }

        const incompleteQuestions = totalQuestions - completedQuestions;
        const percentage = totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;

        return {
          ...specialty,
          progress: {
            totalLectures,
            completedLectures,
            totalQuestions,
            completedQuestions,
            correctQuestions,
            incorrectQuestions,
            partialQuestions,
            incompleteQuestions,
            percentage
          }
        };
      })
    );

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

export const POST = requireAdmin(postHandler); 