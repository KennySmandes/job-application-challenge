import { useEffect, useState } from "react";
import { getCandidateByEmail, getJobs, applyToJob } from "./services/api";

interface Candidate {
  uuid: string;
  candidateId: string;
  applicationId: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Job {
  id: string;
  title: string;
}

function App() {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const email = "agustinkennylab@gmail.com";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const candidateData = await getCandidateByEmail(email);
        const jobsData = await getJobs();
        setCandidate(candidateData);
        setJobs(jobsData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div style={styles.centered}>Cargando...</div>;
  if (error) return <div style={styles.centered}>Error: {error}</div>;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Open Positions</h1>

        <div style={styles.grid}>
          {jobs.map((job) => (
            <div
              key={job.id}
              style={styles.card}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow =
                  "0 18px 45px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 10px 30px rgba(0,0,0,0.08)";
              }}
            >
              <h3 style={styles.jobTitle}>{job.title}</h3>
              {candidate && <JobForm job={job} candidate={candidate} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function JobForm({ candidate }: { job: Job; candidate: Candidate }) {
  const [repoUrl, setRepoUrl] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!repoUrl) {
      setMessage("Ingresá la URL del repo.");
      return;
    }

    setSending(true);
    setMessage(null);

    try {
      const response = await applyToJob({
        applicationId: candidate.applicationId,
        repoUrl,
      });

      if (response.ok) {
        setMessage("Postulación enviada correctamente");
      }
    } catch (err: any) {
      setMessage("Error: " + err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={styles.form}>
      <input
        type="text"
        placeholder="https://github.com/tu-usuario/tu-repo"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
        style={styles.input}
      />

      <button
        onClick={handleSubmit}
        disabled={sending}
        style={{
          ...styles.button,
          opacity: sending ? 0.7 : 1,
          cursor: sending ? "not-allowed" : "pointer",
        }}
        onMouseEnter={(e) => {
          if (!sending) {
            e.currentTarget.style.backgroundColor = "#1d4ed8";
            e.currentTarget.style.transform = "translateY(-2px)";
          }
        }}
        onMouseLeave={(e) => {
          if (!sending) {
            e.currentTarget.style.backgroundColor = "#2563eb";
            e.currentTarget.style.transform = "translateY(0)";
          }
        }}
      >
        {sending ? "Enviando..." : "Submit"}
      </button>

      {message && (
        <p
          style={{
            ...styles.message,
            color: message.toLowerCase().includes("error")
              ? "#dc2626"
              : "#16a34a",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f5f7fb, #e4ecff)",
    padding: "60px 20px",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  centered: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "system-ui, sans-serif",
  },
  title: {
    textAlign: "center",
    fontSize: "2.5rem",
    fontWeight: 700,
    marginBottom: "50px",
    color: "#1a1a1a",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "28px",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "28px",
    borderRadius: "18px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  jobTitle: {
    fontSize: "1.2rem",
    fontWeight: 600,
    color: "#111827",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    outline: "none",
  },
  button: {
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    fontWeight: 600,
    fontSize: "14px",
    transition: "background-color 0.2s ease, transform 0.15s ease",
  },
  message: {
    fontSize: "13px",
    marginTop: "4px",
    fontWeight: 500,
  },
};

export default App;