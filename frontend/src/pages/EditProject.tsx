import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@clerk/clerk-react";
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/api';

export default function EditProject() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getToken } = useAuth();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch project by ID
  useEffect(() => {
    async function fetchProject() {
      try {
        const token = await getToken();
        const res = await apiRequest(`http://localhost:4000/api/projects/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          toast({
            title: "Error",
            description: "Failed to fetch project. Please try again.",
            variant: "destructive",
          });
          navigate("/projects");
          return;
        }

        const data = await res.json();
        setTitle(data.title);
        setDescription(data.description);
      } catch (err) {
        console.error("Error fetching project:", err);
        toast({
          title: "Error",
          description: "An error occurred while fetching the project.",
          variant: "destructive",
        });
        navigate("/projects");
      } finally {
        setFetching(false);
      }
    }

    fetchProject();
  }, [id, getToken, navigate, toast]);

  // Update project
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = await getToken();
      const res = await apiRequest(`http://localhost:4000/api/projects/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: title.trim(), description: description.trim() }),
      });

      if (res.ok) {
        toast({
          title: "Success",
          description: "Project updated successfully!",
        });
        navigate("/projects");
      } else {
        throw new Error("Failed to update project");
      }
    } catch (err) {
      console.error("Error updating project:", err);
      toast({
        title: "Error",
        description: "Failed to update project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate("/projects");

  if (fetching) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/projects">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Edit Project</h1>
            <p className="text-muted-foreground mt-2">
              Update your project details
            </p>
          </div>
        </div>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>
              Update the title and description for your project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter project title"
                  required
                  className="w-full"
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  Choose a clear and descriptive title for your project
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your project goals, scope, and key details..."
                  required
                  rows={6}
                  className="w-full resize-none"
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  Provide a detailed description to help you remember the project's purpose
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  type="submit" 
                  disabled={loading || !title.trim() || !description.trim()}
                  className="gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
