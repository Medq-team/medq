import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const specialtyId = searchParams.get('specialtyId');

    const where = specialtyId ? { specialtyId } : {};

    const lectures = await prisma.lecture.findMany({
      where,
      orderBy: { title: 'asc' },
      include: {
        specialty: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            questions: true
          }
        }
      }
    });
    
    return NextResponse.json(lectures);
  } catch (error) {
    console.error('Error fetching lectures:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lectures' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, specialtyId } = await request.json();

    if (!title || !specialtyId) {
      return NextResponse.json(
        { error: 'Title and specialtyId are required' },
        { status: 400 }
      );
    }

    const lecture = await prisma.lecture.create({
      data: {
        title,
        description,
        specialtyId
      },
      include: {
        specialty: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return NextResponse.json(lecture, { status: 201 });
  } catch (error) {
    console.error('Error creating lecture:', error);
    return NextResponse.json(
      { error: 'Failed to create lecture' },
      { status: 500 }
    );
  }
} 