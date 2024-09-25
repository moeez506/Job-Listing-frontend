import { useEffect, useState } from "react";
import {
  RefreshCw,
  Plus,
  Eye,
  RotateCw,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { client } from "@/src/service";
import { requestMethods } from "@/src/constants";
import { jobsEndpoints } from "@/src/service/endPoints";
import { Job } from "@/src/@types";
import { useRouter } from "next/router";

const initialJobs = [
  { id: "1727133303922", status: "pending" },
  { id: "JOB002", status: "completed" },
  { id: "JOB003", status: "failed" },
];

export default function InteractiveJobsListing() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshAllJobs = () => {
    getJobs();
  };

  const createJob = async () => {
    try {
      const response = await client.request({
        method: requestMethods.POST,
        url: jobsEndpoints.createJob,
        data: null,
      });
      const data = response.data;
      // setJobs(data);
      console.log(response, "response-------------");
      getJobs();
    } catch (error) {
      console.error(error);
    }
    // const newJob = { id: `JOB00${jobs.length + 1}`, status: "pending" };
    // setJobs([...jobs, newJob]);
  };

  const refreshJobStatus = (jobId) => {
    setJobs(
      jobs.map((job) =>
        job.id === jobId
          ? {
              ...job,
              status: ["pending", "completed", "failed"][
                Math.floor(Math.random() * 3)
              ],
            }
          : job
      )
    );
  };

  const viewJobDetails = (jobId) => {
    // console.log(`Viewing details for job ${jobId}...`);
    router.push(`/job/${jobId}`);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getJobs = async () => {
    try {
      const response = await client.request({
        method: requestMethods.GET,
        url: jobsEndpoints.getJobs,
        data: null,
      });
      const data = response.data;
      setJobs(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <header className="mb-8 flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
        <h1 className="text-3xl font-bold text-gray-800">Jobs Listing</h1>
        <div className="flex space-x-4">
          <button
            onClick={refreshAllJobs}
            className="flex items-center bg-gradient-to-r from-blue-500 to-purple-500 text-white transition-all hover:from-blue-600 hover:to-purple-600 p-2 rounded"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh All
          </button>
          <button
            onClick={createJob}
            className="flex items-center bg-gradient-to-r from-green-500 to-teal-500 text-white transition-all hover:from-green-600 hover:to-teal-600 p-2 rounded"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Job
          </button>
        </div>
      </header>

      <AnimatePresence>
        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {jobs.map((job) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white rounded-lg shadow overflow-hidden transition-shadow duration-300 hover:shadow-lg">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800">
                      {job.id}
                    </h2>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(job.status)}
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium ${
                          job.status === "resolved"
                            ? "bg-green-100 text-green-800"
                            : job.status === "failed"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between bg-gradient-to-r from-gray-50 to-gray-100 p-4">
                  <button
                    onClick={() => viewJobDetails(job.id)}
                    className="flex items-center border border-gray-300 rounded p-2 transition-colors hover:bg-gray-200"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </button>
                  <button
                    onClick={() => refreshJobStatus(job.id)}
                    className="flex items-center border border-gray-300 rounded p-2 transition-colors hover:bg-gray-200"
                  >
                    <RotateCw className="mr-2 h-4 w-4" />
                    Refresh Status
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
