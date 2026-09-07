import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Briefcase, Newspaper, Loader2 } from "lucide-react";
import { API_BASE, getAuthHeaders } from "@/utils/api";
import { toast } from "sonner";

function CreatePostForm({ onPostCreated }) {
  const [postType, setPostType] = useState("text");
  const [content, setContent] = useState("");
  const [jobData, setJobData] = useState({
    title: "",
    company: "",
    requirements: "",
    location: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (postType === "text") {
      if (!content.trim()) return;
    } else {
      if (!jobData.title.trim() || !jobData.company.trim() || !jobData.requirements.trim() || !jobData.location.trim()) {
        toast.error("Please fill in all required fields for the job post.");
        return;
      }
    }

    setLoading(true);

    try {
      const endpoint = postType === "text" ? "posts" : "jobs";
      const payload = postType === "text" ? { content } : jobData;

      const res = await fetch(`${API_BASE}/${endpoint}`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      if (postType === "text") {
        setContent("");
      } else {
        setJobData({
          title: "",
          company: "",
          requirements: "",
          location: "",
          description: "",
        });
      }
      toast.success(`${postType === "text" ? "Text Post" : "Job Post"} created successfully!`);
      if (onPostCreated) onPostCreated();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-6 bg-white dark:bg-black dark:border-gray-800">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Create New Post
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="mb-4 flex space-x-2">
          <Button variant={postType === "text" ? "default" : "outline"} onClick={() => setPostType("text")} className={postType === "text" ? "bg-indigo-600 hover:bg-indigo-700" : ""}>
            <Newspaper className="mr-2 h-4 w-4" />
            Text Post
          </Button>

          <Button variant={postType === "job" ? "default" : "outline"} onClick={() => setPostType("job")} className={postType === "job" ? "bg-indigo-600 hover:bg-indigo-700" : ""}>
            <Briefcase className="mr-2 h-4 w-4" />
            Job Post
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {postType === "text" ? (
            <div className="space-y-2">
              <Textarea
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                required
              />
              <p className="text-right text-xs text-gray-400">{content.length} characters</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  placeholder="Enter job title"
                  value={jobData.title}
                  onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    placeholder="Enter company name"
                    value={jobData.company}
                    onChange={(e) => setJobData({ ...jobData, company: e.target.value })}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Enter location"
                    value={jobData.location}
                    onChange={(e) => setJobData({ ...jobData, location: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  placeholder="Enter job requirements"
                  value={jobData.requirements}
                  onChange={(e) => setJobData({ ...jobData, requirements: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Enter job description"
                  value={jobData.description}
                  onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
                  rows={4}
                  className="w-full resize-none"
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            disabled={
              loading ||
              (postType === "text"
                ? !content.trim()
                : !jobData.title.trim() ||
                  !jobData.company.trim() ||
                  !jobData.requirements.trim() ||
                  !jobData.location.trim())
            }
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            Publish
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default CreatePostForm;
