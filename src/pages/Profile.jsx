import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PostCard from "./PostCard";
import CreatePostForm from "./CreatePostForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, MapPin, Calendar, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { API_BASE, getAuthHeaders } from "@/utils/api";

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      alert("Session expired. Please login again.");
      localStorage.removeItem("token");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProfileData(); }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-gray-600">Loading profile...</div>;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-950 p-6">
      <div className="container mx-auto grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* PROFILE COLUMN */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6 bg-white dark:bg-black dark:border-gray-800">
            <CardHeader className="text-center border-b dark:border-gray-800 pb-4">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-indigo-200 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                <User className="h-10 w-10" />
              </div>
              <CardTitle>{profile.name}</CardTitle>
              <CardDescription>{profile.email}</CardDescription>
            </CardHeader>

            <CardContent className="pt-4 space-y-3 text-sm">
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

              <button onClick={handleLogout} className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded">
                Logout
              </button>
            </CardContent>
          </Card>
        </div>

        {/* POSTS/JOBS COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          <CreatePostForm onPostCreated={loadProfileData} />

          <Tabs defaultValue="posts">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="posts">My Text Posts ({posts.length})</TabsTrigger>
              <TabsTrigger value="jobs">My Job Posts ({jobs.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="space-y-4 pt-4">
              {posts.length === 0 ? (
                <Card className="p-4 text-center text-gray-500">No posts yet.</Card>
              ) : posts.map(post => <PostCard key={post._id} post={post} />)}
            </TabsContent>

            <TabsContent value="jobs" className="space-y-4 pt-4">
              {jobs.length === 0 ? (
                <Card className="p-4 text-center text-gray-500">No job posts yet.</Card>
              ) : jobs.map(job => <PostCard key={job._id} post={job} isJob />)}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
