import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface Project {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

// Mock data - replace with API calls later
const initialProjects: Project[] = [
  {
    id: '1',
    title: 'Sample Project',
    description: 'This is a sample project description',
    createdAt: '2025-01-15',
  },
];

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  const handleDelete = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Projects</h1>
          <Link to="/projects/new">
            <Button>Create New Project</Button>
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              No projects yet. Create your first project to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="border border-border bg-white p-6 space-y-3"
              >
                <h2 className="text-xl font-semibold">{project.title}</h2>
                <p className="text-muted-foreground">{project.description}</p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm text-muted-foreground">
                    Created: {project.createdAt}
                  </span>
                  <div className="flex gap-3">
                    <Link to={`/projects/${project.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(project.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
