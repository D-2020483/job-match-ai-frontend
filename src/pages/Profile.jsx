import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PostCard from "./PostCard";
import CreatePostForm from "./CreatePostForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, MapPin, Calendar, Newspaper, Briefcase } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { API_BASE, getAuthHeaders } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";
import { getInitials } from "@/utils/format";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const fetchProfile = async () => {
    const res = await fetch(`${API_BASE}/users/profile`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Failed to fetch profile");
    return res.json();
  };

  const fetchPosts = async () => {
    const res = await fetch(`${API_BASE}/posts/me`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Failed to fetch posts");
    return res.json();
  };

  const fetchJobs = async () => {
    const res = await fetch(`${API_BASE}/jobs/me`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Failed to fetch jobs");
    return res.json();
  };

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const [profileData, postData, jobData] = await Promise.all([fetchProfile(), fetchPosts(), fetchJobs()]);
      setProfile(profileData);
      setPosts(postData);
      setJobs(jobData);
    } catch (err) {
      console.error(err);
      toast.error("Session expired. Please login again.");
      logout();
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProfileData(); }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="page-shell flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="container mx-auto grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="sticky top-24 bg-white dark:bg-black dark:border-gray-800">
            <CardHeader className="text-center border-b dark:border-gray-800 pb-4">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-indigo-200 text-xl font-bold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                {getInitials(profile.name)}
              </div>
              <CardTitle>{profile.name}</CardTitle>
              <CardDescription>{profile.email}</CardDescription>
            </CardHeader>

            <CardContent className="pt-4 space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-indigo-50 px-3 py-2 text-center dark:bg-indigo-950/40">
                  <p className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">{posts.length}</p>
                  <p className="text-xs text-gray-500">Posts</p>
                </div>
                <div className="rounded-lg bg-indigo-50 px-3 py-2 text-center dark:bg-indigo-950/40">
                  <p className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">{jobs.length}</p>
                  <p className="text-xs text-gray-500">Jobs</p>
                </div>
              </div>

              {profile.bio && <p className="font-medium">{profile.bio}</p>}
              {profile.location && (
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>{profile.location}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Joined: {new Date(profile.createdAt).toLocaleDateString()}</span>
              </div>

              <Button onClick={handleLogout} className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white">
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <CreatePostForm onPostCreated={loadProfileData} />

          <Tabs defaultValue="posts">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="posts">
                <Newspaper className="mr-2 h-4 w-4" />
                My Text Posts ({posts.length})
              </TabsTrigger>
              <TabsTrigger value="jobs">
                <Briefcase className="mr-2 h-4 w-4" />
                My Job Posts ({jobs.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="space-y-4 pt-4">
              {posts.length === 0 ? (
                <Card className="p-4 text-center text-gray-500">No posts yet.</Card>
              ) : posts.map((post) => <PostCard key={post._id} post={post} />)}
            </TabsContent>

            <TabsContent value="jobs" className="space-y-4 pt-4">
              {jobs.length === 0 ? (
                <Card className="p-4 text-center text-gray-500">No job posts yet.</Card>
              ) : jobs.map((job) => <PostCard key={job._id} post={job} isJob />)}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
