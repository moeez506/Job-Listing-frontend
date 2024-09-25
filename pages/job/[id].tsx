import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCcw,
} from "lucide-react";
import { url } from "inspector";
import { client } from "@/src/service";
import { requestMethods } from "@/src/constants";
import { jobsEndpoints } from "@/src/service/endPoints";
import PendingJobImage from "@/src/components/PendingJobImage";

const mockJob = {
  id: "JOB001",
  status: "completed",
  title: "Job JOB001",
  createdAt: new Date().toISOString(),
  // result:
  //   "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
};

const SingleJob = () => {
  const router = useRouter();
  const { id } = router.query;
  const [job, setJob] = useState(mockJob);
  const [isLoading, setIsLoading] = useState(false);
  console.log(id);

  const getJobById = async (id: string) => {
    try {
      const response = await client.request({
        method: requestMethods.GET,
        url: jobsEndpoints.getJobById(id),
        data: null,
      });
      const data = response.data;
      setJob(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    if (id) {
      getJobById(id as string);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (id) {
      getJobById(id as string);
    }
  }, [id]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "failed":
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Clock className="h-6 w-6 text-yellow-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
      </button>

      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{job.id}</h1>
            <div className="flex items-center gap-4">
              <span
                className={`flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                  job.status === "resolved"
                    ? "bg-green-100 text-green-800"
                    : job.status === "failed"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {getStatusIcon(job.status)}
                <span className="ml-2 capitalize">{job.status}</span>
              </span>
              <button
                onClick={handleRefresh}
                // className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <RefreshCcw
                  onClick={handleRefresh}
                  className={`mr-2 h-6 w-6 ${isLoading ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 space-y-6">
          <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
            {job.status === "pending" ? (
              <>
                <PendingJobImage />
              </>
            ) : (
              <img
                src={job.result}
                alt={`Image for ${job.id}`}
                className="object-cover w-full h-full"
              />
            )}
            {/* <img
              src={job.result}
              alt={`Image for ${job.title}`}
              className="object-cover w-full h-full"
            />
            <PendingJobImage /> */}
          </div>

          {/* <div>
            <h2 className="text-xl font-semibold mb-2">Job Description</h2>
            <p className="text-gray-600">{job.description}</p>
          </div> */}

          {/* <div>
            <h2 className="text-xl font-semibold mb-2">Job Details</h2>
            <ul className="list-disc list-inside text-gray-600">
              <li>Job ID: {job.id}</li>
              <li>Created At: {new Date(job.createdAt).toLocaleString()}</li>
              <li>
                Status: <span className="capitalize">{job.status}</span>
              </li>
            </ul>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default SingleJob;
