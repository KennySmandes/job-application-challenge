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

export const applyToJob = async (body: {
  uuid: string;
  jobId: string;
  candidateId: string;
  repoUrl: string;
}) => {
  const res = await fetch(`${BASE_URL}/api/candidate/apply-to-job`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error applying");
  }

  return data;
};