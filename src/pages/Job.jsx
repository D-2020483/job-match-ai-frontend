import ApplicationDialog from "./ApplicationDialog";
import RankingDialog from "./RankingDialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building, MapPin, Clock, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { API_BASE, getAuthHeaders } from "@/utils/api";

function Job() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

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


  if (loading) {
    return <p className="text-center text-gray-500 dark:text-gray-400">Loading jobs...</p>;
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-950 transition-colors p-6">
      <div className="container mx-auto max-w-4xl space-y-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Available Job Listings
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {jobs.map((job) => (
            <Card
              key={job._id}
              className="transition-shadow hover:shadow-xl bg-white dark:bg-black dark:border-gray-800"
            >
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl font-semibold text-indigo-700 dark:text-indigo-400">
                  {job.title}
                </CardTitle>

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
                    <span>Posted: {new Date(job.createdAt).toLocaleDateString()}</span>
                  </span>
                </div>

                <div className="border-t pt-3 border-gray-200 dark:border-gray-700">
                  <p className="font-medium text-gray-700 dark:text-gray-100">
                    Requirements:
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {job.requirements}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-300">
                    <User className="h-4 w-4" />
                    <span>Posted by: {job.user?.name || job.user?.handle}</span>
                  </div>

                  <div className="flex space-x-2">
                    <ApplicationDialog jobId={job._id} jobTitle={job.title} />
                    <RankingDialog jobId={job._id} jobTitle={job.title} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Job;
