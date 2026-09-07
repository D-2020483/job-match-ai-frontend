import ApplicationDialog from "./ApplicationDialog";
import RankingDialog from "./RankingDialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building, MapPin, Clock, User, Search, Briefcase } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { API_BASE, getAuthHeaders } from "@/utils/api";
import { Input } from "@/components/ui/input";
import { formatRelativeTime } from "@/utils/format";

function Job() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");

  useEffect(() => {
    async function fetchPosts() {
      try {
        const jobResponse = await fetch(`${API_BASE}/jobs/all`, {
          method: "GET",
          headers: getAuthHeaders(),
        });

        if (!jobResponse.ok) {
          throw new Error("Unauthorized or failed request");
        }

        const jobPosts = await jobResponse.json();
        setJobs(jobPosts);
      } catch (error) {
        console.error("Error fetching job posts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  const locations = useMemo(
    () => ["all", ...new Set(jobs.map((job) => job.location).filter(Boolean))],
    [jobs]
  );

  const filteredJobs = useMemo(() => {
    const search = query.trim().toLowerCase();
    return jobs.filter((job) => {
      if (locationFilter !== "all" && job.location !== locationFilter) return false;
      if (!search) return true;
      const haystack = [job.title, job.company, job.location, job.requirements, job.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(search);
    });
  }, [jobs, query, locationFilter]);

  return (
    <div className="page-shell">
      <div className="container mx-auto max-w-4xl space-y-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              Available Job Listings
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {loading ? "Loading openings..." : `${filteredJobs.length} job${filteredJobs.length === 1 ? "" : "s"} shown`}
            </p>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-3 shadow-sm dark:bg-black dark:border-gray-800">
          <div className="relative mb-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, company, or requirements..."
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {locations.map((location) => (
              <button
                key={location}
                type="button"
                onClick={() => setLocationFilter(location)}
                className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                  locationFilter === location
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {location === "all" ? "All locations" : location}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-64 animate-pulse rounded-xl border bg-white dark:bg-black dark:border-gray-800"
              />
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-white px-6 py-16 text-center text-gray-500 dark:bg-black dark:border-gray-800 dark:text-gray-400">
            <Briefcase className="mx-auto mb-3 h-10 w-10 opacity-50" />
            {jobs.length === 0 ? "No jobs posted yet." : "No jobs match your search."}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {filteredJobs.map((job) => (
              <Card
                key={job._id}
                className="transition-all hover:-translate-y-0.5 hover:shadow-xl hover:border-indigo-200 bg-white dark:bg-black dark:border-gray-800 dark:hover:border-indigo-800"
              >
                <CardHeader className="space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-xl font-semibold text-indigo-700 dark:text-indigo-400">
                      {job.title}
                    </CardTitle>
                    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      Job
                    </span>
                  </div>

                  <CardDescription className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                    <Building className="h-4 w-4" />
                    <span>{job.company}</span>
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-300">
                    <span className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </span>

                    <span className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>Posted: {formatRelativeTime(job.createdAt)}</span>
                    </span>
                  </div>

                  <div className="border-t pt-3 border-gray-200 dark:border-gray-700">
                    <p className="font-medium text-gray-700 dark:text-gray-100">
                      Requirements:
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-4">
                      {job.requirements}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-300">
                      <User className="h-4 w-4" />
                      <span>Posted by: {job.user?.name || job.user?.handle}</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <ApplicationDialog jobId={job._id} jobTitle={job.title} />
                      <RankingDialog jobId={job._id} jobTitle={job.title} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Job;
