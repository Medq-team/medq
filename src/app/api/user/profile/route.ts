import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, AuthenticatedRequest } from '../../../../lib/auth-middleware';
import { prisma } from '../../../../lib/prisma';

async function getHandler(request: AuthenticatedRequest) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: request.user!.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

async function putHandler(request: AuthenticatedRequest) {
  try {
    const { firstName, lastName, email } = await request.json();
    
    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: request.user!.userId },
      data: {
        name: firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName,
        email: email || undefined,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    return NextResponse.json({ 
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(getHandler);
export const PUT = requireAuth(putHandler); 