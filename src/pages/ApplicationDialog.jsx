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
import { Send, Briefcase, Loader2, Sparkles } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";

function ApplicationDialog({ jobId, jobTitle }) {
  const [coverLetter, setCoverLetter] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasApplied, setHasApplied] = useState(false);
  const [aiMatch, setAiMatch] = useState(null);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("http://127.0.0.1:8000/cover-letter/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          job_description: jobTitle,
          education: "BSc in Computer Science",
          cover_letter: coverLetter,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error("AI evaluation failed");
      }

      setAiMatch(data.cover_letter_match);
      setHasApplied(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="ml-4 bg-indigo-600 hover:bg-indigo-700">
          {hasApplied ? "View Rankings" : "Apply Now"}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <Briefcase className="h-5 w-5 text-indigo-600" />
            <DialogTitle>Apply for Job</DialogTitle>
          </div>
          <DialogDescription>
            You are applying for <strong>{jobTitle}</strong>
          </DialogDescription>
        </DialogHeader>

        {/* Cover Letter Input */}
        {!hasApplied && (
          <div className="space-y-2">
            <Label htmlFor="coverLetter">Cover Letter</Label>
            <Textarea
              id="coverLetter"
              rows={12}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Write your application. This content will be evaluated by AI."
            />
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center gap-2 text-indigo-600 py-4">
            <Loader2 className="animate-spin" />
            Evaluating with AI...
          </div>
        )}

        {hasApplied && aiMatch && (
          <div className="mt-4 p-4 rounded-lg border bg-indigo-50 dark:bg-gray-900">
            <h3 className="flex items-center gap-2 font-semibold text-indigo-700 mb-3">
              <Sparkles className="h-4 w-4" />
              AI Cover Letter Match
            </h3>

            <div className="space-y-2 text-sm">
              <p>
                <strong>Job Description:</strong>{" "}
                {aiMatch.job_description_match}
              </p>
              <p>
                <strong>Education:</strong> {aiMatch.education_match}
              </p>
              <p>
                <strong>Requirements:</strong> {aiMatch.requirements_match}
              </p>

              <div className="text-lg font-bold text-green-700 mt-2">
                Overall Match: {aiMatch.overall_match}
              </div>

              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {aiMatch.summary}
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

        <DialogFooter>
          {!hasApplied ? (
            <Button
              onClick={handleSubmit}
              disabled={coverLetter.trim().split(/\s+/).length < 100 || loading}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Send className="mr-2 h-4 w-4" />
              Submit Application
            </Button>
          ) : (
            <Button
              onClick={() => setOpen(false)}
              className="bg-green-600 hover:bg-green-700"
            >
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ApplicationDialog;
