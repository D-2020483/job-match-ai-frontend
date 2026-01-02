import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  User,
  MessageCircle,
  Heart,
  Briefcase,
  Newspaper,
  MapPin,
} from "lucide-react";

function PostCard({ post, isJob }) {
  const timestamp = post.createdAt || post.timestamp || new Date();

  return (
    <Card className="shadow-md transition-shadow hover:shadow-lg bg-white dark:bg-black dark:border-gray-700">
      <CardHeader className="flex items-start justify-between pb-2">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300">
            <User className="h-5 w-5" />
          </div>

          <div>
            <CardTitle className="text-base text-gray-900 dark:text-gray-100">
              {post.user?.name || "Unknown"}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
              • {new Date(timestamp).toLocaleString()}
            </CardDescription>
          </div>
        </div>

        <div>
          {isJob ? (
            <Briefcase className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          ) : (
            <Newspaper className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          )}
        </div>
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
            <p>
              <strong>Location:</strong> {post.location}
            </p>
            <p>
              <strong>Requirements:</strong>
            </p>
            <pre className="pl-2 whitespace-pre-wrap wrap-break-word">{post.requirements}</pre>{" "}
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

      {/* Like & Comment Section */}
      <div className="mt-2 flex justify-start gap-6 border-t pt-3 border-gray-200 dark:border-gray-700 pl-4">
        <button className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
          <Heart className="h-4 w-4" />
          <span>Like ({post.likes || 0})</span>
        </button>

        <button className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
          <MessageCircle className="h-4 w-4" />
          <span>Comment ({post.comments || 0})</span>
        </button>
      </div>
    </Card>
  );
}

export default PostCard;
