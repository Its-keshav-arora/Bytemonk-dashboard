import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/db';
import Project from '@/models/Project';

// GET /api/projects - Get all projects (Both Admin & MCP can read)
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