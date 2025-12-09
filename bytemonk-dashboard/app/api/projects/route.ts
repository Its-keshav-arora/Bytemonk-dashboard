import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import { checkRole } from '@/utils/roles';

// GET /api/projects - Get all projects for the authenticated user
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const projects = await Project.find({ ownerId: userId }).sort({
      createdAt: -1,
    });

    return NextResponse.json(projects);
  } catch (err) {
    console.error('Error fetching projects:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    // Secure role check
    const isMcp = await checkRole('mcp');
    if (isMcp) {
      return NextResponse.json(
        { message: 'Forbidden: MCP role can only perform read operations' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { title, description } = body;

    if (!title) {
      return NextResponse.json(
        { message: 'Title is required' },
        { status: 400 }
      );
    }

    const project = new Project({
      title,
      description: description || '',
      ownerId: userId
    });

    await project.save();

    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    console.error('Error creating project:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}