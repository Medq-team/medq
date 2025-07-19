import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const specialties = await prisma.specialty.findMany({
      take: 5,
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            lectures: true
          }
        }
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Specialties API working with Prisma!',
      specialties
    });
  } catch (error) {
    console.error('Error fetching specialties:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch specialties',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 