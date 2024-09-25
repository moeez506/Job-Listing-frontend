import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ArrowLeft, RefreshCcw } from "lucide-react";
import { client } from "@/src/service";
import { requestMethods } from "@/src/constants";
import { jobsEndpoints } from "@/src/service/endPoints";
import PendingJobImage from "@/src/components/PendingJobImage";
import { Job } from "@/src/@types";
import Loading from "@/src/components/Loading";
import getStatusIcon from "@/src/components/GetStatusIcon";

const SingleJob = () => {
  const router = useRouter();
  const { id } = router.query;
  const [job, setJob] = useState<Job>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  console.log(id);

  const getJobById = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await client.request({
        method: requestMethods.GET,
        url: jobsEndpoints.getJobById(id),
        data: null,
      });
      const data = response.data;
      setJob(data);
    } catch (error) {
      window.alert("Something went wrong try again!");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    if (id) {
      getJobById(id as string);
    }
  };

  useEffect(() => {
    if (id) {
      getJobById(id as string);
    }
  }, [id]);

  if (isLoading) {
    return <Loading />;
  }

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
            <h1 className="text-3xl font-bold">{job?.id}</h1>
            <div className="flex items-center gap-4">
              <span
                className={`flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                  job?.status === "resolved"
                    ? "bg-green-100 text-green-800"
                    : job?.status === "failed"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {getStatusIcon(job?.status)}
                <span className="ml-2 capitalize">{job?.status}</span>
              </span>
              <button onClick={handleRefresh}>
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
            {job?.status === "pending" ? (
              <>
                <PendingJobImage />
              </>
            ) : (
              <img
                src={job?.result}
                alt={`Image for ${job?.id}`}
                className="object-cover w-full h-full"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleJob;
