import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function EditProject() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Fetch project by ID
  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`http://localhost:4000/api/projects/${id}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          console.error("Failed to fetch project");
          return;
        }

        const data = await res.json();
        setTitle(data.title);
        setDescription(data.description);
      } catch (err) {
        console.error("Error fetching project:", err);
      }
    }

    fetchProject();
  }, [id]);

  // Update project
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:4000/api/projects/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });

      if (res.ok) {
        navigate("/projects");
      } else {
        console.error("Failed to update project");
      }
    } catch (err) {
      console.error("Error updating project:", err);
    }
  };

  const handleCancel = () => navigate("/projects");

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
