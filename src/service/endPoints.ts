export const jobsEndpoints = {
  createJob: "/job",
  getJobs: "/job",
  getJobById: (id: string) => `/job/${id}`,
};
