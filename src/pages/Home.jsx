import React, { useEffect, useMemo, useState } from "react";
import PostCard from "@/pages/PostCard.jsx";
import { API_BASE, getAuthHeaders } from "@/utils/api";
import { Input } from "@/components/ui/input";
import { Search, Newspaper, Briefcase, Inbox } from "lucide-react";

export function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function fetchPosts() {
      try {
        const jobResponse = await fetch(`${API_BASE}/jobs/all`, {
          method: "GET",
          headers: getAuthHeaders(),
        });
        if (!jobResponse.ok) throw new Error("Failed to fetch job posts");
        const jobPosts = await jobResponse.json();

        const textResponse = await fetch(`${API_BASE}/posts/all`, {
          method: "GET",
          headers: getAuthHeaders(),
        });
        if (!textResponse.ok) throw new Error("Failed to fetch text posts");
        const textPosts = await textResponse.json();

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

  const filteredPosts = useMemo(() => {
    const search = query.trim().toLowerCase();

    return posts.filter((post) => {
      const isJob = Boolean(post.title && post.company);
      if (filter === "jobs" && !isJob) return false;
      if (filter === "posts" && isJob) return false;
      if (!search) return true;

      const haystack = [
        post.user?.name,
        post.content,
        post.title,
        post.company,
        post.location,
        post.requirements,
        post.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(search);
    });
  }, [posts, query, filter]);

  const filters = [
    { id: "all", label: "All", icon: Inbox },
    { id: "posts", label: "Community", icon: Newspaper },
    { id: "jobs", label: "Jobs", icon: Briefcase },
  ];

  return (
    <div className="page-shell">
      <div className="container mx-auto max-w-2xl space-y-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            Community Feed
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Latest community posts and job openings, in one place.
          </p>
        </div>

        <div className="rounded-xl border bg-white p-3 shadow-sm dark:bg-black dark:border-gray-800">
          <div className="relative mb-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search posts, jobs, companies..."
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setFilter(id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors ${
                  filter === id
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-40 animate-pulse rounded-xl border bg-white dark:bg-black dark:border-gray-800"
              />
            ))}
          </div>
        ) : filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostCard
              key={post._id || post.id}
              post={post}
              isJob={!!post.title && !!post.company}
            />
          ))
        ) : (
          <div className="rounded-xl border border-dashed bg-white px-6 py-12 text-center text-gray-500 dark:bg-black dark:border-gray-800 dark:text-gray-400">
            <Inbox className="mx-auto mb-3 h-10 w-10 opacity-50" />
            {posts.length === 0
              ? "No posts yet. Be the first to post!"
              : "No posts match your search."}
          </div>
        )}

        {!loading && filteredPosts.length > 0 && (
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-4">
            End of posts for now.
          </div>
        )}
      </div>
    </div>
  );
}
