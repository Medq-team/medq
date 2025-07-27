import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireAdmin, AuthenticatedRequest } from '@/lib/auth-middleware';
import { prisma } from '@/lib/prisma';

async function getHandler(request: AuthenticatedRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lectureId = searchParams.get('lectureId');
    const questionId = searchParams.get('questionId');
    const status = searchParams.get('status');

    const where: any = {};
    if (lectureId) where.lectureId = lectureId;
    if (questionId) where.questionId = questionId;
    if (status) where.status = status;

    const reports = await prisma.report.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        question: {
          select: {
            id: true,
            text: true,
            type: true
          }
        },
        lecture: {
          select: {
            id: true,
            title: true
          }
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    });
    
    return NextResponse.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}

async function postHandler(request: AuthenticatedRequest) {
  try {
    const { questionId, lectureId, message } = await request.json();
    const userId = request.user!.userId;

    if (!questionId || !lectureId || !message) {
      return NextResponse.json(
        { error: 'questionId, lectureId, and message are required' },
        { status: 400 }
      );
    }

    const report = await prisma.report.create({
      data: {
        questionId,
        lectureId,
        message,
        userId,
        status: 'pending'
      },
      include: {
        question: {
          select: {
            id: true,
            text: true,
            type: true
          }
        },
        lecture: {
          select: {
            id: true,
            title: true
          }
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json(
      { error: 'Failed to create report' },
      { status: 500 }
    );
  }
}

export const GET = requireAdmin(getHandler);
export const POST = requireAuth(postHandler); 