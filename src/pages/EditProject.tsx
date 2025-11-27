import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function EditProject() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock data - replace with API call later
  const [title, setTitle] = useState('Sample Project');
  const [description, setDescription] = useState(
    'This is a sample project description'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission - replace with API call later
    console.log('Updating project:', { id, title, description });
    navigate('/projects');
  };

  const handleCancel = () => {
    navigate('/projects');
  };

  return (
    <Layout>
      <div className="max-w-2xl space-y-8">
        <h1 className="text-3xl font-bold">Edit Project</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={6}
              className="w-full"
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit">Save Changes</Button>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
