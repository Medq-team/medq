import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, requireAdmin, AuthenticatedRequest } from '@/lib/auth-middleware';

export async function GET() {
  try {
    const specialties = await prisma.specialty.findMany({
      orderBy: { name: 'asc' }
    });
    
    return NextResponse.json(specialties);
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
    const { name, description, imageUrl } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const specialty = await prisma.specialty.create({
      data: {
        name,
        description: description || null,
        imageUrl: imageUrl || null,
      }
    });

    return NextResponse.json(specialty, { status: 201 });
  } catch (error) {
    console.error('Error creating specialty:', error);
    return NextResponse.json(
      { error: 'Failed to create specialty' },
      { status: 500 }
    );
  }
}

export const POST = requireAdmin(postHandler); 