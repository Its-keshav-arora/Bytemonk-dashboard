import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/db';
import Project from '@/models/Project';

// GET /api/projects/[id] - Get a single project
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    if (project.ownerId !== userId) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(project);
  } catch (err) {
    console.error('Error fetching project:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// PUT /api/projects/[id] - Update a project
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check role - MCP role can only read
    const role = req.headers.get('x-user-role') || 'human';
    if (role === 'mcp') {
      return NextResponse.json(
        { message: 'Forbidden: MCP role can only perform read operations' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    if (project.ownerId !== userId) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { title, description } = body;

    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;

    await project.save();
    return NextResponse.json(project);
  } catch (err) {
    console.error('Error updating project:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// DELETE /api/projects/[id] - Delete a project
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check role - MCP role can only read
    const role = req.headers.get('x-user-role') || 'human';
    if (role === 'mcp') {
      return NextResponse.json(
        { message: 'Forbidden: MCP role can only perform read operations' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    if (project.ownerId !== userId) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await project.deleteOne();
    return NextResponse.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Error deleting project:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

