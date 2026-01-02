import React, { useEffect, useState } from "react";
import PostCard from "@/pages/PostCard.jsx";
import { API_BASE, getAuthHeaders } from "@/utils/api"; // adjust path if needed

export function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        // Fetch job posts
        const jobResponse = await fetch(`${API_BASE}/jobs/all`, {
          method: "GET",
          headers: getAuthHeaders(),
        });
        if (!jobResponse.ok) throw new Error("Failed to fetch job posts");
        const jobPosts = await jobResponse.json();

        // Fetch text posts
        const textResponse = await fetch(`${API_BASE}/posts/all`, {
          method: "GET",
          headers: getAuthHeaders(),
        });
        if (!textResponse.ok) throw new Error("Failed to fetch text posts");
        const textPosts = await textResponse.json();

        // Merge posts and sort by creation time (latest first)
        const allPosts = [...textPosts, ...jobPosts].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setPosts(allPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-950 p-6 transition-colors">
      <div className="container mx-auto max-w-2xl space-y-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
          Community Feed
        </h2>

        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            Loading posts...
          </div>
        ) : posts.length > 0 ? (
          posts.map((post) => 
          <PostCard 
          key={post.id} 
          post={post}
          isJob={!!post.title && !!post.company}
          />
          
        )) : (
          <div className="text-center text-gray-500 dark:text-gray-400">
            No posts yet. Be the first to post!
          </div>
        )}

        {!loading && posts.length > 0 && (
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-4">
            End of posts for now.
          </div>
        )}
      </div>
    </div>
  );
}
