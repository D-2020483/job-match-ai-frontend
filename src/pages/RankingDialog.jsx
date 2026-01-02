import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trophy, Star, Loader2, Users } from "lucide-react";
import React, { useState, useEffect } from "react";
import { API_BASE, getAuthHeaders } from "@/utils/api";

function RankingDialog({ jobId, jobTitle }) {
  const [rankings, setRankings] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRankings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE}/applications/rank/${jobId}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch rankings");

      setRankings(data.rankings);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (isOpen) => {
    setOpen(isOpen);
    if (isOpen && rankings.length === 0) {
      fetchRankings();
    }
  };

  useEffect(() => {
    if (open) {
      fetchRankings();
    }
  }, [open, jobId]);

  const getRankBadgeColor = (index) => {
    switch (index) {
      case 0:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600";
      case 1:
        return "bg-gradient-to-r from-gray-400 to-gray-600";
      case 2:
        return "bg-gradient-to-r from-orange-400 to-orange-600";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="ml-2 border-green-600 text-green-600 hover:bg-green-50">
          <Trophy className="mr-2 h-4 w-4" />
          View Rankings
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto p-6">
        <DialogHeader>
          <div className="flex items-center space-x-2 mb-2">
            <Trophy className="h-6 w-6 text-green-600" />
            <DialogTitle className="text-lg font-bold text-gray-900 dark:text-gray-100">
              AI Candidate Rankings
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
            AI-powered rankings for <strong>{jobTitle}</strong>
          </DialogDescription>
        </DialogHeader>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 text-green-600 py-10">
            <Loader2 className="animate-spin h-8 w-8" />
            <span className="text-sm font-medium">Analyzing candidates with AI...</span>
          </div>
        )}

        {/* Rankings */}
        {!loading && rankings.length > 0 && (
          <div className="space-y-4 mt-4">
            {rankings.map((ranking, index) => (
              <div
                key={ranking.id}
                className="flex items-start space-x-4 p-4 rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 hover:shadow transition-shadow duration-200"
              >
                {/* Rank Badge */}
                <div className="flex-shrink-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${getRankBadgeColor(
                      index
                    )}`}
                  >
                    {ranking.rank}
                  </div>
                </div>

                {/* Candidate Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-md">
                      {ranking.name || "Anonymous Candidate"}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{ranking.score}/100</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300">{ranking.reason}</p>

                  {/* Match Percentage Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>AI Match Percentage</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{ranking.matchPercentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700">
                      <div
                        className="h-2 rounded-full bg-green-500 transition-all duration-500"
                        style={{ width: `${ranking.matchPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Rankings */}
        {!loading && rankings.length === 0 && !error && (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            <Users className="h-14 w-14 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No applications to rank yet.</p>
          </div>
        )}

        {/* Error Message */}
        {error && <p className="text-sm text-red-600 mt-4 text-center">{error}</p>}

        <DialogFooter className="mt-4">
          <Button onClick={() => setOpen(false)} variant="outline">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default RankingDialog;
