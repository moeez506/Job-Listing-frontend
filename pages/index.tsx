import { useEffect, useState } from "react";
import { RefreshCw, Plus, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { client } from "@/src/service";
import { requestMethods } from "@/src/constants";
import { jobsEndpoints } from "@/src/service/endPoints";
import { Job } from "@/src/@types";
import { useRouter } from "next/router";
import Loading from "@/src/components/Loading";
import getStatusIcon from "@/src/components/GetStatusIcon";

export default function Home() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const refreshAllJobs = () => {
    getJobs();
  };

  const createJob = async () => {
    setIsLoading(true);
    try {
      const response = await client.request({
        method: requestMethods.POST,
        url: jobsEndpoints.createJob,
        data: null,
      });
      getJobs();
    } catch (error) {
      console.error(error);
      window.alert("Something went wrong try again!");
    } finally {
      setIsLoading(false);
    }
  };

  const viewJobDetails = (jobId) => {
    router.push(`/job/${jobId}`);
  };

  const getJobs = async () => {
    try {
      setIsLoading(true);
      const response = await client.request({
        method: requestMethods.GET,
        url: jobsEndpoints.getJobs,
        data: null,
      });
      const data = response.data;
      setJobs(data);
    } catch (error) {
      console.error(error);
      window.alert("Something went wrong try again!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getJobs();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
        <header className="mb-8 flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
          <h1 className="text-3xl font-bold text-gray-800">Jobs Listing</h1>
          <div className="flex space-x-4">
            <button
              onClick={refreshAllJobs}
              className="flex items-center bg-gradient-to-r from-blue-500 to-purple-500 text-white transition-all hover:from-blue-600 hover:to-purple-600 p-2 rounded"
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
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
          {jobs.length === 0 ? (
            <motion.div
              className="flex justify-center items-center h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-xl text-gray-800">No jobs created yet</p>
            </motion.div>
          ) : (
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
                          JOB ID
                        </h2>
                        <h2 className="text-xl font-bold text-gray-800 ml-2">
                          {job.id}
                        </h2>
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
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
