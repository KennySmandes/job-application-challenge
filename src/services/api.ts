const BASE_URL =
  "https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net";

export const getCandidateByEmail = async (email: string) => {
  const res = await fetch(
    `${BASE_URL}/api/candidate/get-by-email?email=${email}`
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error fetching candidate");
  }

  return data;
};

export const getJobs = async () => {
  const res = await fetch(`${BASE_URL}/api/jobs/get-list`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error("Error fetching jobs");
  }

  return data;
};

export const applyToJob = async (data: {
  applicationId: string;
  repoUrl: string;
}) => {
  const response = await fetch(
    "https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net/api/candidate/apply-to-job",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error applying to job");
  }

  return response.json();
};