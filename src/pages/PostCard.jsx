import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  MessageCircle,
  Heart,
  Briefcase,
  Newspaper,
  MapPin,
  Send,
} from "lucide-react";
import { getInitials, formatRelativeTime } from "@/utils/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function PostCard({ post, isJob }) {
  const timestamp = post.createdAt || post.timestamp || new Date();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [expanded, setExpanded] = useState(false);

  const handleLike = () => {
    setLiked((prev) => {
      const next = !prev;
      setLikeCount((count) => count + (next ? 1 : -1));
      return next;
    });
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setComments((prev) => [
      ...prev,
      { id: Date.now(), text: commentText.trim() },
    ]);
    setCommentText("");
  };

  const longRequirements = String(post.requirements || "").length > 220;

  return (
    <Card className="shadow-md transition-all hover:shadow-lg hover:border-indigo-200 bg-white dark:bg-black dark:border-gray-700 dark:hover:border-indigo-800">
      <CardHeader className="flex items-start justify-between pb-2">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300">
            {getInitials(post.user?.name)}
          </div>

          <div>
            <CardTitle className="text-base text-gray-900 dark:text-gray-100">
              {post.user?.name || "Unknown"}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
              {formatRelativeTime(timestamp)}
            </CardDescription>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
          {isJob ? <Briefcase className="h-3.5 w-3.5" /> : <Newspaper className="h-3.5 w-3.5" />}
          {isJob ? "Job" : "Post"}
        </span>
      </CardHeader>

      <CardContent className="whitespace-pre-line text-gray-800 dark:text-gray-100 leading-relaxed">
        {isJob ? (
          <div className="space-y-2">
            <p>
              <strong>Title:</strong> {post.title}
            </p>
            <p>
              <strong>Company:</strong> {post.company}
            </p>
            <p className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-gray-400" />
              <strong>Location:</strong> {post.location}
            </p>
            <p>
              <strong>Requirements:</strong>
            </p>
            <pre className={`pl-2 whitespace-pre-wrap wrap-break-word ${!expanded && longRequirements ? "line-clamp-4" : ""}`}>
              {post.requirements}
            </pre>
            {longRequirements && (
              <button
                type="button"
                className="text-sm text-indigo-600 hover:underline"
                onClick={() => setExpanded((value) => !value)}
              >
                {expanded ? "Show less" : "Show more"}
              </button>
            )}
            {post.description && post.description.trim() && (
              <div>
                <p>
                  <strong>Description:</strong>
                </p>
                <pre className="pl-2 whitespace-pre-wrap wrap-break-word">{post.description}</pre>
              </div>
            )}
          </div>
        ) : (
          <p>{post.content}</p>
        )}
      </CardContent>

      <div className="mt-2 flex justify-start gap-6 border-t pt-3 border-gray-200 dark:border-gray-700 px-6">
        <button
          type="button"
          onClick={handleLike}
          className={`flex items-center space-x-1 text-sm transition-colors ${
            liked
              ? "text-indigo-600 dark:text-indigo-400"
              : "text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
          }`}
        >
          <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
          <span>Like ({likeCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setShowComments((value) => !value)}
          className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          <MessageCircle className="h-4 w-4" />
          <span>Comment ({comments.length || post.comments || 0})</span>
        </button>
      </div>

      {showComments && (
        <div className="space-y-3 px-6 pb-4 pt-2">
          {comments.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">Be the first to comment.</p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="rounded-lg bg-gray-50 px-3 py-2 text-sm dark:bg-gray-900"
              >
                {comment.text}
              </div>
            ))
          )}
          <form onSubmit={handleComment} className="flex gap-2">
            <Input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
            />
            <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </Card>
  );
}

export default PostCard;
