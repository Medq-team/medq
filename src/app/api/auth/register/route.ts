import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        role: 'student' // Default role
      }
    });
    
    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      user: userWithoutPassword,
      message: 'User registered successfully'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
} 