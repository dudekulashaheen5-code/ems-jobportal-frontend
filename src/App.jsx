import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [page, setPage] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState("");

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [jobFilter, setJobFilter] = useState("All");
  const [companyJobSearch, setCompanyJobSearch] = useState("");

  const [profile, setProfile] = useState({
    phone: "",
    education: "",
    skills: ""
  });

  const [phone, setPhone] = useState("");
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState("");

  const [selectedJob, setSelectedJob] = useState(null);

  const [applicationName, setApplicationName] = useState("");
  const [applicationEmail, setApplicationEmail] = useState("");
  const [applicationPhone, setApplicationPhone] = useState("");
  const [applicationEducation, setApplicationEducation] = useState("");
  const [applicationSkills, setApplicationSkills] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [isApplying, setIsApplying] = useState(false);

  const [applicantDetails, setApplicantDetails] = useState({});
  const [loadingApplicantDetails, setLoadingApplicantDetails] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");

  const [jobTitle, setJobTitle] = useState("");
  const [jobCompany, setJobCompany] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [jobSalary, setJobSalary] = useState("");
  const [jobSkills, setJobSkills] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [jobQualification, setJobQualification] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [editingJobId, setEditingJobId] = useState(null);

  const [selectedCompany, setSelectedCompany] = useState("");
  const [companyJobs, setCompanyJobs] = useState([]);
  const [companyJobsLoading, setCompanyJobsLoading] = useState(false);

  const [externalApplications, setExternalApplications] = useState([]);

  const [externalCounts, setExternalCounts] = useState({
    APPLIED: 0,
    SHORTLISTED: 0,
    REJECTED: 0
  });

  const companies = [
    { name: "Amazon", icon: "📦", description: "Explore Amazon career opportunities." },
    { name: "Infosys", icon: "💻", description: "Explore Infosys career opportunities." },
    { name: "Cognizant", icon: "🏢", description: "Explore Cognizant career opportunities." },
    { name: "Microsoft", icon: "🪟", description: "Explore Microsoft career opportunities." },
    { name: "Google", icon: "🔎", description: "Explore Google career opportunities." }
  ];

  const getTokenPayload = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(character => "%" + ("00" + character.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Unable to read JWT token", error);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const payload = getTokenPayload(token);
    if (!payload) {
      localStorage.clear();
      return;
    }

    const savedRole = payload.role;
    const savedUserId = payload.userId;
    const savedUserName = payload.name;
    const savedUserEmail = payload.sub;

    if (savedRole && savedUserId) {
      localStorage.setItem("role", savedRole);
      localStorage.setItem("userId", savedUserId);
      localStorage.setItem("userName", savedUserName || "");
      localStorage.setItem("userEmail", savedUserEmail || "");

      setIsLoggedIn(true);
      setRole(savedRole);
      setUserId(savedUserId);
      setUserName(savedUserName || "");
      setUserEmail(savedUserEmail || "");
      setPage(savedRole === "ADMIN" ? "adminDashboard" : "dashboard");
    }
  }, []);

  const login = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.text();
      if (!response.ok) {
        alert(data || "Login failed");
        return;
      }

      if (data === "User not found" || data === "Invalid password") {
        alert(data);
        return;
      }

      const payload = getTokenPayload(data);
      if (!payload) {
        alert("Invalid login token");
        return;
      }

      const userRole = payload.role;
      const loggedInUserId = payload.userId;
      const loggedInUserName = payload.name;
      const loggedInUserEmail = payload.sub;

      if (!userRole || !loggedInUserId) {
        alert("Login information is incomplete. Please login again.");
        return;
      }

      localStorage.setItem("token", data);
      localStorage.setItem("role", userRole);
      localStorage.setItem("userId", loggedInUserId);
      localStorage.setItem("userName", loggedInUserName || "");
      localStorage.setItem("userEmail", loggedInUserEmail || "");

      setRole(userRole);
      setUserId(loggedInUserId);
      setUserName(loggedInUserName || "");
      setUserEmail(loggedInUserEmail || "");
      setIsLoggedIn(true);
      setEmail("");
      setPassword("");
      setPage(userRole === "ADMIN" ? "adminDashboard" : "dashboard");
    } catch (error) {
      console.error(error);
      alert("Cannot connect to backend");
    }
  };

  const registerUser = async (e) => {
    e.preventDefault();

    if (!registerName || !registerEmail || !registerPassword || !registerConfirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (registerPassword.length < 6) {
      alert("Password must contain at least 6 characters");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          password: registerPassword
        })
      });

      const data = await response.text();
      if (!response.ok) {
        alert(data || "Registration failed");
        return;
      }

      alert("Registration successful! Please login.");
      setRegisterName("");
      setRegisterEmail("");
      setRegisterPassword("");
      setRegisterConfirmPassword("");
      setEmail(registerEmail);
      setPage("login");
    } catch (error) {
      console.error(error);
      alert("Cannot connect to backend");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");

    setIsLoggedIn(false);
    setRole("");
    setUserId(null);
    setUserName("");
    setUserEmail("");
    setCompanyJobs([]);
    setSelectedCompany("");
    setCompanyJobSearch("");
    setPage("login");
  };

  const loadJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/jobs", {
        headers: { Authorization: "Bearer " + token }
      });

      if (!response.ok) {
        alert("Unable to load jobs");
        return [];
      }

      const data = await response.json();
      setJobs(data);
      return data;
    } catch (error) {
      console.error(error);
      alert("Cannot load jobs");
      return [];
    }
  };

  const openJobs = async () => {
    await loadJobs();
    setSearchText("");
    setJobFilter("All");
    setPage("jobs");
  };

  const openCompanies = () => {
    setSelectedCompany("");
    setCompanyJobs([]);
    setCompanyJobSearch("");
    setPage("companies");
  };

  const openCompanyJobs = async (companyName) => {
    setSelectedCompany(companyName);
    setCompanyJobs([]);
    setCompanyJobSearch("");
    setCompanyJobsLoading(true);
    setPage("companyJobs");

    try {
      const response = await fetch(`http://localhost:8080/api/company-jobs/${encodeURIComponent(companyName)}`);
      if (!response.ok) {
        alert(`Unable to load ${companyName} career jobs.`);
        setCompanyJobs([]);
        return;
      }

      const data = await response.json();
      setCompanyJobs(Array.isArray(data) ? data : []);

      if (!Array.isArray(data) || data.length === 0) {
        alert(`Official ${companyName} career jobs are not available yet.`);
      }
    } catch (error) {
      console.error(error);
      setCompanyJobs([]);
      alert(`Cannot load ${companyName} career jobs.`);
    } finally {
      setCompanyJobsLoading(false);
    }
  };

  const applyExternalCompanyJob = (job) => {
    if (!job || !job.jobUrl) {
      alert("Official application link is not available.");
      return;
    }
    window.open(job.jobUrl, "_blank", "noopener,noreferrer");
  };

  const loadExternalApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/external-applications", {
        method: "GET",
        headers: { Authorization: "Bearer " + token }
      });

      if (!response.ok) {
        alert("Unable to load company application data.");
        return;
      }

      const data = await response.json();
      setExternalApplications(Array.isArray(data) ? data : []);

      let applied = 0;
      let shortlisted = 0;
      let rejected = 0;

      (Array.isArray(data) ? data : []).forEach(application => {
        const status = (application.status || "").toUpperCase();
        if (status === "APPLIED") applied++;
        if (status === "SHORTLISTED") shortlisted++;
        if (status === "REJECTED") rejected++;
      });

      setExternalCounts({ APPLIED: applied, SHORTLISTED: shortlisted, REJECTED: rejected });
    } catch (error) {
      console.error(error);
      alert("Cannot load company application data.");
    }
  };

  const confirmExternalApplication = async (job) => {
    if (!job) {
      alert("Job information not found.");
      return;
    }

    const existingApplication = externalApplications.find(application =>
      String(application.jobId) === String(job.jobId) &&
      String(application.userId) === String(userId)
    );

    if (!existingApplication || !existingApplication.id) {
      alert("The backend does not have an application record for this job yet.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/external-applications/${existingApplication.id}/status?status=APPLIED`, {
        method: "PUT",
        headers: { Authorization: "Bearer " + token }
      });

      if (!response.ok) {
        alert("Unable to confirm application.");
        return;
      }

      alert("Application marked as Applied!");
      await loadExternalApplications();
    } catch (error) {
      console.error(error);
      alert("Cannot connect to backend.");
    }
  };

  const openAdminCompanyPaths = async () => {
    setSelectedCompany("");
    setCompanyJobs([]);
    await loadExternalApplications();
    setPage("adminCompanyPaths");
  };

  const openAdminCompanyJobs = async (companyName) => {
    setSelectedCompany(companyName);
    setCompanyJobs([]);
    setCompanyJobSearch("");
    setCompanyJobsLoading(true);
    setPage("adminCompanyJobs");

    try {
      const response = await fetch(`http://localhost:8080/api/company-jobs/${encodeURIComponent(companyName)}`);
      if (!response.ok) {
        alert(`Unable to load ${companyName} career jobs.`);
        setCompanyJobs([]);
        return;
      }

      const data = await response.json();
      setCompanyJobs(Array.isArray(data) ? data : []);

      if (!Array.isArray(data) || data.length === 0) {
        alert(`Official ${companyName} career jobs are not available yet.`);
      }
    } catch (error) {
      console.error(error);
      setCompanyJobs([]);
      alert(`Cannot load ${companyName} career jobs.`);
    } finally {
      setCompanyJobsLoading(false);
    }
  };

  const openOfficialCompanyJob = (job) => {
    if (!job || !job.jobUrl) {
      alert("Official application link is not available.");
      return;
    }
    window.open(job.jobUrl, "_blank", "noopener,noreferrer");
  };

  const getCompanyJobDetails = (job) => {
    const jobTitle = job?.title || job?.jobTitle || "Job title not available";
    const companyName = job?.company || selectedCompany || "Company not available";
    const location = job?.location || job?.jobLocation || "Not available";
    const jobId = job?.jobId ?? job?.id ?? job?.requisitionId ?? job?.referenceNumber ?? "Not available";
    const postedDate = job?.postedDate || job?.posted || job?.datePosted || job?.publicationDate || "Not available";
    const description = job?.description || job?.jobDescription || job?.summary || "Description not available.";
    const jobType = job?.type || job?.jobType || "Job";

    return { title: jobTitle, company: companyName, location, jobId, postedDate, description, type: jobType };
  };

  const loadProfile = async () => {
    if (!userId) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/profile/${userId}`, {
        headers: { Authorization: "Bearer " + token }
      });

      if (!response.ok) return;

      const data = await response.json();
      if (data) {
        setProfile(data);
        setPhone(data.phone || "");
        setEducation(data.education || "");
        setSkills(data.skills || "");
        setApplicationPhone(data.phone || "");
        setApplicationEducation(data.education || "");
        setApplicationSkills(data.skills || "");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openProfile = async () => {
    await loadProfile();
    setPage("profile");
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert("User information not found. Please login again.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/profile/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({ userId, phone, education, skills })
      });

      if (response.ok) {
        alert("Profile saved successfully!");
        await loadProfile();
      } else {
        alert("Failed to save profile");
      }
    } catch (error) {
      console.error(error);
      alert("Cannot connect to backend");
    }
  };

  const loadApplications = async () => {
    if (!userId) {
      alert("User information not found. Please login again.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/applications/user/${userId}`, {
        headers: { Authorization: "Bearer " + token }
      });

      if (!response.ok) {
        alert("Unable to load applications");
        return;
      }

      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error(error);
      alert("Cannot load applications");
    }
  };

  const openApplications = async () => {
    await loadJobs();
    await loadApplications();
    setPage("applications");
  };

  const openApplyForm = async (job) => {
    if (!userId) {
      alert("User information not found. Please login again.");
      return;
    }

    setSelectedJob(job);
    setApplicationName(userName || "");
    setApplicationEmail(userEmail || "");
    setApplicationPhone(phone || "");
    setApplicationEducation(education || "");
    setApplicationSkills(skills || "");
    setResumeFile(null);

    await loadProfile();
    setPage("apply");
  };

  const submitApplication = async (e) => {
    e.preventDefault();
    if (!selectedJob) { alert("Please select a job"); return; }
    if (!userId) { alert("User information not found. Please login again."); return; }
    if (!applicationName || !applicationEmail || !applicationPhone || !applicationEducation || !applicationSkills) {
      alert("Please fill all details");
      return;
    }
    if (!resumeFile) { alert("Please upload your resume"); return; }
    if (resumeFile.type !== "application/pdf") { alert("Please upload PDF resume only"); return; }
    if (resumeFile.size > 5 * 1024 * 1024) { alert("Resume size must be less than 5 MB."); return; }

    try {
      setIsApplying(true);
      const token = localStorage.getItem("token");

      const profileResponse = await fetch(`http://localhost:8080/api/profile/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ userId, phone: applicationPhone, education: applicationEducation, skills: applicationSkills })
      });

      if (!profileResponse.ok) {
        alert("Unable to save your application details.");
        setIsApplying(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", resumeFile);

      const resumeResponse = await fetch(`http://localhost:8080/api/profile/${userId}/resume`, {
        method: "PUT",
        headers: { Authorization: "Bearer " + token },
        body: formData
      });

      if (!resumeResponse.ok) {
        alert("Resume upload failed.");
        setIsApplying(false);
        return;
      }

      const applicationResponse = await fetch("http://localhost:8080/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ userId, jobId: selectedJob.id })
      });

      if (!applicationResponse.ok) {
        const errorText = await applicationResponse.text();
        alert(errorText || "Application submission failed.");
        setIsApplying(false);
        return;
      }

      alert("Application submitted successfully!");
      setSelectedJob(null);
      setApplicationName("");
      setApplicationEmail("");
      setApplicationPhone("");
      setApplicationEducation("");
      setApplicationSkills("");
      setResumeFile(null);
      setIsApplying(false);

      await loadApplications();
      setPage("applications");
    } catch (error) {
      console.error(error);
      setIsApplying(false);
      alert("Cannot connect to backend");
    }
  };

  const cancelApply = () => {
    setSelectedJob(null);
    setApplicationName("");
    setApplicationEmail("");
    setApplicationPhone("");
    setApplicationEducation("");
    setApplicationSkills("");
    setResumeFile(null);

    if (selectedCompany) setPage("companyJobs");
    else setPage("jobs");
  };

  const openAdminJobs = async () => {
    await loadJobs();
    setPage("adminJobs");
  };

  const clearJobForm = () => {
    setJobTitle("");
    setJobCompany("");
    setJobLocation("");
    setJobType("");
    setJobSalary("");
    setJobSkills("");
    setJobExperience("");
    setJobQualification("");
    setJobDescription("");
    setEditingJobId(null);
  };

  const addJob = async (e) => {
    e.preventDefault();
    if (!jobTitle || !jobCompany || !jobLocation || !jobType || !jobSalary || !jobSkills || !jobExperience || !jobQualification || !jobDescription) {
      alert("Please fill all fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ title: jobTitle, company: jobCompany, location: jobLocation, type: jobType, salary: jobSalary, skills: jobSkills, experience: jobExperience, qualification: jobQualification, description: jobDescription })
      });

      if (response.ok) {
        alert("Job / Internship added successfully!");
        clearJobForm();
        await loadJobs();
      } else {
        alert("Failed to add job");
      }
    } catch (error) {
      console.error(error);
      alert("Cannot connect to backend");
    }
  };

  const editJob = (job) => {
    setEditingJobId(job.id);
    setJobTitle(job.title || "");
    setJobCompany(job.company || "");
    setJobLocation(job.location || "");
    setJobType(job.type || "");
    setJobSalary(job.salary || "");
    setJobSkills(job.skills || "");
    setJobExperience(job.experience || "");
    setJobQualification(job.qualification || "");
    setJobDescription(job.description || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateJob = async (e) => {
    e.preventDefault();
    if (!jobTitle || !jobCompany || !jobLocation || !jobType || !jobSalary || !jobSkills || !jobExperience || !jobQualification || !jobDescription) {
      alert("Please fill all fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/jobs/${editingJobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ title: jobTitle, company: jobCompany, location: jobLocation, type: jobType, salary: jobSalary, skills: jobSkills, experience: jobExperience, qualification: jobQualification, description: jobDescription })
      });

      if (response.ok) {
        alert("Job / Internship updated successfully!");
        clearJobForm();
        await loadJobs();
      } else {
        alert("Failed to update job");
      }
    } catch (error) {
      console.error(error);
      alert("Cannot connect to backend");
    }
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/jobs/${jobId}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token }
      });

      if (response.ok) {
        alert("Job deleted successfully!");
        setJobs(jobs.filter(job => job.id !== jobId));
      } else {
        alert("Failed to delete job");
      }
    } catch (error) {
      console.error(error);
      alert("Cannot connect to backend");
    }
  };

  const loadAdminApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      let allApplications = [];

      const jobsResponse = await fetch("http://localhost:8080/api/jobs", {
        headers: { Authorization: "Bearer " + token }
      });

      if (!jobsResponse.ok) {
        alert("Unable to load jobs");
        return;
      }

      const jobData = await jobsResponse.json();
      setJobs(jobData);

      for (const job of jobData) {
        const applicationResponse = await fetch(`http://localhost:8080/api/applications/job/${job.id}`, {
          headers: { Authorization: "Bearer " + token }
        });

        if (applicationResponse.ok) {
          const jobApplications = await applicationResponse.json();
          allApplications = [...allApplications, ...jobApplications];
        }
      }

      setApplications(allApplications);
      setPage("adminApplications");
      await loadApplicantDetails(allApplications);
    } catch (error) {
      console.error(error);
      alert("Cannot load applications");
    }
  };

  const loadApplicantDetails = async (applicationList) => {
    if (!applicationList || applicationList.length === 0) {
      setApplicantDetails({});
      return;
    }

    try {
      setLoadingApplicantDetails(true);
      const token = localStorage.getItem("token");
      const details = {};
      let allUsers = users;

      if (allUsers.length === 0) {
        const usersResponse = await fetch("http://localhost:8080/api/users", {
          headers: { Authorization: "Bearer " + token }
        });

        if (usersResponse.ok) {
          allUsers = await usersResponse.json();
          setUsers(allUsers);
        }
      }

      for (const application of applicationList) {
        const applicationUserId = application.userId;
        const user = allUsers.find(item => Number(item.id) === Number(applicationUserId));
        let profileData = null;

        try {
          const profileResponse = await fetch(`http://localhost:8080/api/profile/${applicationUserId}`, {
            headers: { Authorization: "Bearer " + token }
          });
          if (profileResponse.ok) profileData = await profileResponse.json();
        } catch (error) {
          console.error(error);
        }

        details[applicationUserId] = {
          name: user?.name || "User",
          email: user?.email || "",
          phone: profileData?.phone || "Not provided",
          education: profileData?.education || "Not provided",
          skills: profileData?.skills || "Not provided",
          resume: profileData?.resumeFileName || "Resume uploaded"
        };
      }

      setApplicantDetails(details);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingApplicantDetails(false);
    }
  };

  const updateApplicationStatus = async (applicationId, status) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/applications/${applicationId}/status?status=${status}`, {
        method: "PUT",
        headers: { Authorization: "Bearer " + token }
      });

      if (response.ok) {
        alert(`Application ${status.toLowerCase()} successfully!`);
        setApplications(applications.map(app => app.id === applicationId ? { ...app, status } : app));
      } else {
        alert("Failed to update application");
      }
    } catch (error) {
      console.error(error);
      alert("Cannot connect to backend");
    }
  };

  const viewResume = async (applicationUserId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/profile/${applicationUserId}/resume`, {
        method: "GET",
        headers: { Authorization: "Bearer " + token }
      });

      if (!response.ok) {
        alert(
          response.status === 404 ? "Resume not found for this user." :
          response.status === 403 ? "You are not authorized to view this resume." : "Unable to open resume."
        );
        return;
      }

      const blob = await response.blob();
      const fileUrl = window.URL.createObjectURL(blob);
      window.open(fileUrl, "_blank");
    } catch (error) {
      console.error(error);
      alert("Cannot connect to backend");
    }
  };

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/users", {
        method: "GET",
        headers: { Authorization: "Bearer " + token }
      });

      if (!response.ok) {
        alert(
          response.status === 401 ? "Please login again as Admin." :
          response.status === 403 ? "You are not authorized to view users." : "Unable to load users."
        );
        return;
      }

      const data = await response.json();
      setUsers(data);
      setPage("adminUsers");
    } catch (error) {
      console.error(error);
      alert("Cannot connect to backend");
    }
  };

  const getJobTitle = (jobId) => {
    const job = jobs.find(item => Number(item.id) === Number(jobId));
    return job ? job.title : "Job not found";
  };

  const filteredCompanyJobs = companyJobs.filter(job => {
    const search = companyJobSearch.toLowerCase().trim();
    const details = getCompanyJobDetails(job);

    return (
      details.title.toLowerCase().includes(search) ||
      details.location.toLowerCase().includes(search) ||
      details.type.toLowerCase().includes(search) ||
      details.description.toLowerCase().includes(search) ||
      details.company.toLowerCase().includes(search)
    );
  });

  const filteredAdminCompanyJobs = filteredCompanyJobs;

  const filteredJobs = jobs.filter(job => {
    const search = searchText.toLowerCase().trim();
    const title = (job.title || "").toLowerCase();
    const company = (job.company || "").toLowerCase();
    const type = (job.type || "").toLowerCase();

    const matchesSearch = title.includes(search) || company.includes(search);
    const matchesFilter = jobFilter === "All" || type === jobFilter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  if (page === "login") {
    return (
      <div className="login-page">
        <div className="login-box">
          <h1>Job & Internship Portal</h1>
          <p className="login-subtitle">Find your next opportunity</p>
          <form onSubmit={login}>
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit">Login</button>
          </form>
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <p>Don't have an account?</p>
            <button
              type="button"
              onClick={() => {
                setRegisterName("");
                setRegisterEmail("");
                setRegisterPassword("");
                setRegisterConfirmPassword("");
                setPage("register");
              }}
              style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", fontSize: "16px", fontWeight: "600" }}
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (page === "register") {
    return (
      <div className="login-page">
        <div className="login-box">
          <h1>Create Account</h1>
          <p className="login-subtitle">Create your user account</p>
          <form onSubmit={registerUser}>
            <input type="text" placeholder="Full Name" value={registerName} onChange={e => setRegisterName(e.target.value)} required />
            <input type="email" placeholder="Email" value={registerEmail} onChange={e => setRegisterEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={registerPassword} onChange={e => setRegisterPassword(e.target.value)} required />
            <input type="password" placeholder="Confirm Password" value={registerConfirmPassword} onChange={e => setRegisterConfirmPassword(e.target.value)} required />
            <button type="submit">Create Account</button>
          </form>
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <p>Already have an account?</p>
            <button
              type="button"
              onClick={() => {
                setRegisterName("");
                setRegisterEmail("");
                setRegisterPassword("");
                setRegisterConfirmPassword("");
                setPage("login");
              }}
              style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", fontSize: "16px", fontWeight: "600" }}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (page === "dashboard" && role === "USER") {
    return (
      <div className="app">
        <nav className="navbar">
          <div className="logo">JobPortal</div>
          <div className="nav-buttons">
            <button onClick={openProfile}>Profile</button>
            <button onClick={openJobs}>Jobs</button>
            <button onClick={openApplications}>My Applications</button>
            <button onClick={openCompanies}>Top Companies</button>
            <button onClick={logout}>Logout</button>
          </div>
        </nav>
        <div className="dashboard">
          <div className="welcome-card" style={{ textAlign: "left" }}>
            <h1 style={{ margin: "0 0 10px 0" }}>Welcome, {userName || "User"} 👋</h1>
            <p style={{ margin: "0 0 20px 0" }}>Find jobs and internships that match your skills.</p>
            <button className="main-button" onClick={openJobs}>Explore Jobs</button>
          </div>
          <div className="dashboard-cards">
            <div className="dashboard-card" onClick={openProfile}>
              <h2>👤</h2>
              <h3>My Profile</h3>
              <p>Manage your personal information and skills.</p>
            </div>
            <div className="dashboard-card" onClick={openJobs}>
              <h2>💼</h2>
              <h3>Jobs & Internships</h3>
              <p>Search and apply for opportunities.</p>
            </div>
            <div className="dashboard-card" onClick={openApplications}>
              <h2>📋</h2>
              <h3>My Applications</h3>
              <p>Track your application status.</p>
            </div>
            <div className="dashboard-card" onClick={openCompanies}>
              <h2>🏢</h2>
              <h3>Top Companies</h3>
              <p>Explore jobs from Amazon, Infosys, Cognizant, Microsoft and Google.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (page === "companies" && role === "USER") {
    return (
      <div className="app">
        <nav className="navbar">
          <div className="logo">JobPortal</div>
          <div className="nav-buttons">
            <button onClick={() => setPage("dashboard")}>Dashboard</button>
            <button onClick={openJobs}>Jobs</button>
            <button onClick={openApplications}>Applications</button>
            <button onClick={logout}>Logout</button>
          </div>
        </nav>
        <div className="jobs-page">
          <h1 style={{ textAlign: "center" }}>Top Companies</h1>
          <p className="page-subtitle" style={{ textAlign: "center" }}>Explore career opportunities from top companies.</p>
          <div className="dashboard-cards">
            {companies.map(company => (
              <div className="dashboard-card" key={company.name}>
                <h2 style={{ fontSize: "45px" }}>{company.icon}</h2>
                <h3>{company.name}</h3>
                <p>{company.description}</p>
                <button className="apply-button" onClick={() => openCompanyJobs(company.name)}>Apply</button>
              </div>
            ))}
          </div>
          <button className="back-button" onClick={() => setPage("dashboard")}>← Back to Dashboard</button>
        </div>
      </div>
    );
  }

  if (page === "companyJobs" && role === "USER") {
    return (
      <div className="app">
        <nav className="navbar">
          <div className="logo">JobPortal</div>
          <div className="nav-buttons">
            <button onClick={() => setPage("dashboard")}>Dashboard</button>
            <button onClick={openCompanies}>Top Companies</button>
            <button onClick={openJobs}>Jobs</button>
            <button onClick={openApplications}>Applications</button>
            <button onClick={logout}>Logout</button>
          </div>
        </nav>
        <div className="jobs-page">
          <h1 style={{ textAlign: "center" }}>{selectedCompany} Career Path</h1>
          <p className="page-subtitle" style={{ textAlign: "center" }}>Explore {selectedCompany} career opportunities.</p>
          <div className="job-search-box" style={{ marginBottom: "25px" }}>
            <input
              type="text"
              placeholder={`🔍 Search ${selectedCompany} jobs by title, location or type`}
              value={companyJobSearch}
              onChange={e => setCompanyJobSearch(e.target.value)}
            />
          </div>
          {companyJobsLoading ? (
            <div className="empty-box">
              <h2>Loading {selectedCompany} jobs...</h2>
              <p>Please wait while we fetch the latest opportunities.</p>
            </div>
          ) : companyJobs.length === 0 ? (
            <div className="empty-box">
              <h2>{selectedCompany} Jobs</h2>
              <p>Official {selectedCompany} career jobs are not available right now.</p>
            </div>
          ) : filteredCompanyJobs.length === 0 ? (
            <div className="empty-box">
              <h2>No Matching Jobs Found</h2>
              <p>Try a different search.</p>
            </div>
          ) : (
            <div className="job-list">
              {filteredCompanyJobs.map(job => {
                const details = getCompanyJobDetails(job);
                const confirmed = externalApplications.some(
                  application =>
                    String(application.jobId) === String(details.jobId) &&
                    String(application.userId) === String(userId) &&
                    String(application.status).toUpperCase() === "APPLIED"
                );

                return (
                  <div className="job-card" key={details.jobId || details.title} style={{ padding: "24px", marginBottom: "24px", textAlign: "left", boxSizing: "border-box" }}>
                    <div className="job-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "15px", flexWrap: "wrap", marginBottom: "18px" }}>
                      <div>
                        <h2 style={{ margin: "0 0 10px 0" }}>{details.title}</h2>
                        <h3 style={{ margin: "0" }}>{details.company}</h3>
                      </div>
                      <span className="job-type">{details.type}</span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", margin: "18px 0", padding: "16px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                      <p style={{ margin: "0", lineHeight: "1.6" }}>
                        <strong>📍 Location:</strong> {details.location}
                      </p>
                      <p style={{ margin: "0", lineHeight: "1.6" }}>
                        <strong>🆔 Job ID:</strong> {details.jobId}
                      </p>
                      <p style={{ margin: "0", lineHeight: "1.6" }}>
                        <strong>📅 Posted Date:</strong> {details.postedDate}
                      </p>
                      <div style={{ marginTop: "6px" }}>
                        <strong>📝 Description:</strong>
                        <p style={{ margin: "6px 0 0 0", lineHeight: "1.8", whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
                          {details.description}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                      <button type="button" className="apply-button" onClick={() => applyExternalCompanyJob(job)}>Apply</button>
                      <button type="button" className="main-button" disabled={confirmed} onClick={() => confirmExternalApplication(job)}>{confirmed ? "Applied ✓" : "I Applied"}</button>
                    </div>
                    {confirmed && <p style={{ color: "green", marginTop: "12px" }}>You marked this opportunity as Applied.</p>}
                  </div>
                );
              })}
            </div>
          )}
          <button className="back-button" onClick={openCompanies}>← Back to Top Companies</button>
        </div>
      </div>
    );
  }

  if (page === "profile" && role === "USER") {
    return (
      <div className="app">
        <nav className="navbar">
          <div className="logo">JobPortal</div>
          <div className="nav-buttons">
            <button onClick={() => setPage("dashboard")}>Dashboard</button>
            <button onClick={openJobs}>Jobs</button>
            <button onClick={openApplications}>Applications</button>
            <button onClick={openCompanies}>Top Companies</button>
            <button onClick={logout}>Logout</button>
          </div>
        </nav>
        <div className="form-page">
          <div className="form-box">
            <h1>My Profile</h1>
            <p>Update your profile information</p>
            <form onSubmit={saveProfile}>
              <label>Phone Number</label>
              <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Enter phone number" />
              <label>Education</label>
              <input type="text" value={education} onChange={e => setEducation(e.target.value)} placeholder="Example: B.Tech AIML" />
              <label>Skills</label>
              <input type="text" value={skills} onChange={e => setSkills(e.target.value)} placeholder="Example: Python, Java, SQL" />
              <button type="submit">Save Profile</button>
            </form>
            <button className="back-button" onClick={() => setPage("dashboard")}>Back to Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  if (page === "jobs" && role === "USER") {
    return (
      <div className="app">
        <nav className="navbar">
          <div className="logo">JobPortal</div>
          <div className="nav-buttons">
            <button onClick={() => setPage("dashboard")}>Dashboard</button>
            <button onClick={openProfile}>Profile</button>
            <button onClick={openApplications}>Applications</button>
            <button onClick={openCompanies}>Top Companies</button>
            <button onClick={logout}>Logout</button>
          </div>
        </nav>
        <div className="jobs-page">
          <h1 style={{ textAlign: "center" }}>Jobs & Internships</h1>
          <p className="page-subtitle" style={{ textAlign: "center" }}>Explore available opportunities</p>
          <div className="job-search-box">
            <input type="text" placeholder="🔍 Search by job title or company" value={searchText} onChange={e => setSearchText(e.target.value)} />
            <select value={jobFilter} onChange={e => setJobFilter(e.target.value)}>
              <option value="All">All</option>
              <option value="Internship">Internship</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
            </select>
          </div>
          <div className="job-list">
            {jobs.length === 0 ? (
              <div className="empty-box">No jobs available.</div>
            ) : filteredJobs.length === 0 ? (
              <div className="empty-box">
                <h2>No Matching Jobs Found</h2>
                <p>Try a different search or filter.</p>
              </div>
            ) : (
              filteredJobs.map(job => (
                <div className="job-card" key={job.id} style={{ textAlign: "left" }}>
                  <div className="job-header">
                    <div>
                      <h2>{job.title}</h2>
                      <h3>{job.company}</h3>
                    </div>
                    <span className="job-type">{job.type}</span>
                  </div>
                  <p>📍 {job.location}</p>
                  <p>💰 {job.salary}</p>
                  <p>🛠 {job.skills}</p>
                  <p>🎓 <strong>Qualification:</strong> {job.qualification}</p>
                  <p>💼 <strong>Experience:</strong> {job.experience}</p>
                  <p className="job-description">{job.description}</p>
                  <button className="apply-button" onClick={() => openApplyForm(job)}>Apply Now</button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  if (page === "apply" && role === "USER") {
    return (
      <div className="app">
        <nav className="navbar">
          <div className="logo">JobPortal</div>
          <div className="nav-buttons">
            <button onClick={cancelApply}>Back</button>
            <button onClick={logout}>Logout</button>
          </div>
        </nav>
        <div className="form-page">
          <div className="form-box" style={{ maxWidth: "700px" }}>
            <h1>Apply for Job</h1>
            <p>Submit your application directly through JobPortal.</p>
            {selectedJob && (
              <div style={{ background: "#f3f4f6", padding: "15px", borderRadius: "10px", marginBottom: "20px", textAlign: "left" }}>
                <h2>{selectedJob.title}</h2>
                <p><strong>Company:</strong> {selectedJob.company}</p>
                <p><strong>Type:</strong> {selectedJob.type}</p>
                <p><strong>Location:</strong> {selectedJob.location}</p>
                <p><strong>Salary / Stipend:</strong> {selectedJob.salary}</p>
                <p><strong>Qualification:</strong> {selectedJob.qualification}</p>
                <p><strong>Experience:</strong> {selectedJob.experience}</p>
                <p><strong>Skills:</strong> {selectedJob.skills}</p>
              </div>
            )}
            <form onSubmit={submitApplication}>
              <label>Full Name</label>
              <input type="text" value={applicationName} onChange={e => setApplicationName(e.target.value)} placeholder="Enter your full name" required />
              <label>Email</label>
              <input type="email" value={applicationEmail} onChange={e => setApplicationEmail(e.target.value)} placeholder="Enter your email" required />
              <label>Phone Number</label>
              <input type="text" value={applicationPhone} onChange={e => setApplicationPhone(e.target.value)} placeholder="Enter phone number" required />
              <label>Education</label>
              <input type="text" value={applicationEducation} onChange={e => setApplicationEducation(e.target.value)} placeholder="Example: B.Tech AIML" required />
              <label>Skills</label>
              <textarea value={applicationSkills} onChange={e => setApplicationSkills(e.target.value)} placeholder="Example: Java, Python, SQL, React" rows="4" required />
              <label>Upload Resume</label>
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={e => {
                  const file = e.target.files[0];
                  if (!file) { setResumeFile(null); return; }
                  if (file.type !== "application/pdf") { alert("Please upload PDF resume only."); e.target.value = ""; setResumeFile(null); return; }
                  if (file.size > 5 * 1024 * 1024) { alert("Resume must be less than 5 MB."); e.target.value = ""; setResumeFile(null); return; }
                  setResumeFile(file);
                }}
                required
              />
              {resumeFile && <p style={{ marginTop: "8px", color: "green" }}>📄 Selected Resume: {resumeFile.name}</p>}
              <button type="submit" disabled={isApplying} style={{ marginTop: "20px" }}>{isApplying ? "Submitting..." : "Submit Application"}</button>
            </form>
            <button type="button" className="back-button" onClick={cancelApply} disabled={isApplying}>← Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  if (page === "applications" && role === "USER") {
    return (
      <div className="app">
        <nav className="navbar">
          <div className="logo">JobPortal</div>
          <div className="nav-buttons">
            <button onClick={() => setPage("dashboard")}>Dashboard</button>
            <button onClick={openProfile}>Profile</button>
            <button onClick={openJobs}>Jobs</button>
            <button onClick={openCompanies}>Top Companies</button>
            <button onClick={logout}>Logout</button>
          </div>
        </nav>
        <div className="applications-page">
          <h1 style={{ textAlign: "center" }}>My Applications</h1>
          <p className="page-subtitle" style={{ textAlign: "center" }}>Track your job and internship applications</p>
          <div className="application-list">
            {applications.length === 0 ? (
              <div className="empty-box">You have not applied for any jobs yet.</div>
            ) : (
              applications.map(application => {
                const job = jobs.find(item => Number(item.id) === Number(application.jobId));
                const statusClass = application.status?.toLowerCase().replace(" ", "-");

                return (
                  <div className="application-card" key={application.id} style={{ textAlign: "left", padding: "24px", marginBottom: "24px" }}>
                    <div className="application-top" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "15px", marginBottom: "18px" }}>
                      <div>
                        <h2 style={{ margin: "0 0 6px 0" }}>Application #{application.id}</h2>
                        <h3 style={{ margin: "0" }}>{job ? job.title : "Job not found"}</h3>
                      </div>
                      <span className={`status ${statusClass}`}>{application.status}</span>
                    </div>
                    {job && (
                      <div className="application-job-details" style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "16px 0", padding: "16px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                        <p style={{ margin: "0", lineHeight: "1.6" }}><strong>Company:</strong> {job.company}</p>
                        <p style={{ margin: "0", lineHeight: "1.6" }}><strong>Type:</strong> {job.type}</p>
                        <p style={{ margin: "0", lineHeight: "1.6" }}><strong>Location:</strong> {job.location}</p>
                        <p style={{ margin: "0", lineHeight: "1.6" }}><strong>Qualification:</strong> {job.qualification}</p>
                        <p style={{ margin: "0", lineHeight: "1.6" }}><strong>Experience:</strong> {job.experience}</p>
                      </div>
                    )}
                    <div className="application-details" style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "14px" }}>
                      <p style={{ margin: "0", lineHeight: "1.6" }}><strong>Job ID:</strong> {application.jobId}</p>
                      <p style={{ margin: "0", lineHeight: "1.6" }}><strong>User ID:</strong> {application.userId}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  }

  if (page === "adminDashboard" && role === "ADMIN") {
    return (
      <div className="app">
        <nav className="navbar admin-navbar">
          <div className="logo">JobPortal Admin</div>
          <div className="nav-buttons"><button onClick={logout}>Logout</button></div>
        </nav>
        <div className="admin-dashboard">
          <div className="admin-welcome" style={{ textAlign: "left" }}>
            <h1 style={{ margin: "0 0 10px 0" }}>Admin Dashboard</h1>
            <p style={{ margin: "0" }}>Manage jobs, internships, applications and company career paths.</p>
          </div>
          <div className="admin-cards">
            <div className="admin-card" onClick={openAdminJobs}>
              <div className="admin-icon">💼</div>
              <h2>Manage Jobs</h2>
              <p>Add, view and delete jobs and internships.</p>
            </div>
            <div className="admin-card" onClick={loadAdminApplications}>
              <div className="admin-icon">📋</div>
              <h2>Applications</h2>
              <p>View applicant details, resumes and update application status.</p>
            </div>
            <div className="admin-card" onClick={loadUsers}>
              <div className="admin-icon">👥</div>
              <h2>Users</h2>
              <p>View and manage registered users.</p>
            </div>
            <div className="admin-card" onClick={openAdminCompanyPaths}>
              <div className="admin-icon">🏢</div>
              <h2>Company Career Paths</h2>
              <p>View jobs and internships from top company career sources.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (page === "adminCompanyPaths" && role === "ADMIN") {
    return (
      <div className="app">
        <nav className="navbar admin-navbar">
          <div className="logo">JobPortal Admin</div>
          <div className="nav-buttons">
            <button onClick={() => setPage("adminDashboard")}>Dashboard</button>
            <button onClick={openAdminJobs}>Manage Jobs</button>
            <button onClick={loadAdminApplications}>Applications</button>
            <button onClick={loadUsers}>Users</button>
            <button onClick={logout}>Logout</button>
          </div>
        </nav>
        <div className="admin-jobs-page">
          <h1 style={{ textAlign: "center" }}>Company Career Paths</h1>
          <p className="page-subtitle" style={{ textAlign: "center" }}>View current career opportunities from top companies.</p>
          <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "18px 22px", marginBottom: "25px", fontSize: "18px", fontWeight: "600", textAlign: "center" }}>
            <span>Applied - {externalCounts.APPLIED}</span>
            <span style={{ margin: "0 18px", color: "#94a3b8" }}>|</span>
            <span>Shortlisted - {externalCounts.SHORTLISTED}</span>
            <span style={{ margin: "0 18px", color: "#94a3b8" }}>|</span>
            <span>Rejected - {externalCounts.REJECTED}</span>
          </div>
          <div style={{ background: "#eff6ff", padding: "18px", borderRadius: "12px", marginBottom: "25px", textAlign: "left" }}>
            <strong>Important:</strong> These jobs are fetched from company career sources. Admin does not need to manually add these jobs.
          </div>
          <div className="dashboard-cards">
            {companies.map(company => (
              <div className="dashboard-card" key={company.name}>
                <h2 style={{ fontSize: "45px" }}>{company.icon}</h2>
                <h3>{company.name}</h3>
                <p>{company.description}</p>
                <button className="apply-button" onClick={() => openAdminCompanyJobs(company.name)}>View Career Jobs</button>
              </div>
            ))}
          </div>
          <button className="back-button" onClick={() => setPage("adminDashboard")}>← Back to Admin Dashboard</button>
        </div>
      </div>
    );
  }

  if (page === "adminCompanyJobs" && role === "ADMIN") {
    return (
      <div className="app">
        <nav className="navbar admin-navbar">
          <div className="logo">JobPortal Admin</div>
          <div className="nav-buttons">
            <button onClick={() => setPage("adminDashboard")}>Dashboard</button>
            <button onClick={openAdminCompanyPaths}>Company Career Paths</button>
            <button onClick={logout}>Logout</button>
          </div>
        </nav>
        <div className="admin-jobs-page">
          <h1 style={{ textAlign: "center" }}>{selectedCompany} Career Path</h1>
          <p className="page-subtitle" style={{ textAlign: "center" }}>Explore {selectedCompany} career opportunities.</p>
          <div className="job-search-box" style={{ marginBottom: "25px" }}>
            <input
              type="text"
              placeholder={`🔍 Search ${selectedCompany} jobs by title, location or type`}
              value={companyJobSearch}
              onChange={e => setCompanyJobSearch(e.target.value)}
            />
          </div>
          {companyJobsLoading ? (
            <div className="empty-box">
              <h2>Loading career jobs...</h2>
              <p>Please wait.</p>
            </div>
          ) : companyJobs.length === 0 ? (
            <div className="empty-box">
              <h2>No Career Jobs Available</h2>
              <p>Official {selectedCompany} career jobs are not available yet.</p>
            </div>
          ) : filteredAdminCompanyJobs.length === 0 ? (
            <div className="empty-box">
              <h2>No Matching Jobs Found</h2>
              <p>Try a different search.</p>
            </div>
          ) : (
            <div className="admin-job-list">
              {filteredAdminCompanyJobs.map(job => {
                const details = getCompanyJobDetails(job);

                return (
                  <div className="admin-job-card" key={details.jobId || details.title} style={{ padding: "24px", marginBottom: "24px", boxSizing: "border-box", textAlign: "left" }}>
                    <div className="admin-job-info" style={{ width: "100%" }}>
                      <div className="admin-job-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "15px", flexWrap: "wrap", marginBottom: "18px" }}>
                        <h2 style={{ margin: "0" }}>{details.title}</h2>
                        <span className="job-type">{details.type}</span>
                      </div>
                      <h3 style={{ margin: "0 0 18px 0" }}>{details.company}</h3>

                      <div style={{ display: "flex", flexDirection: "column", gap: "12px", margin: "18px 0", padding: "16px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                        <p style={{ margin: "0", lineHeight: "1.6" }}>
                          <strong>📍 Location:</strong> {details.location}
                        </p>
                        <p style={{ margin: "0", lineHeight: "1.6" }}>
                          <strong>🆔 Job ID:</strong> {details.jobId}
                        </p>
                        <p style={{ margin: "0", lineHeight: "1.6" }}>
                          <strong>📅 Posted Date:</strong> {details.postedDate}
                        </p>
                        <div style={{ marginTop: "6px" }}>
                          <strong>📝 Description:</strong>
                          <p style={{ margin: "6px 0 0 0", lineHeight: "1.8", whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
                            {details.description}
                          </p>
                        </div>
                      </div>

                      <button type="button" className="apply-button" onClick={() => openOfficialCompanyJob(job)}>Apply</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <button className="back-button" onClick={openAdminCompanyPaths}>← Back to Company Career Paths</button>
        </div>
      </div>
    );
  }

  if (page === "adminJobs" && role === "ADMIN") {
    return (
      <div className="app">
        <nav className="navbar admin-navbar">
          <div className="logo">JobPortal Admin</div>
          <div className="nav-buttons">
            <button onClick={() => setPage("adminDashboard")}>Dashboard</button>
            <button onClick={loadAdminApplications}>Applications</button>
            <button onClick={loadUsers}>Users</button>
            <button onClick={openAdminCompanyPaths}>Company Career Paths</button>
            <button onClick={logout}>Logout</button>
          </div>
        </nav>
        <div className="admin-jobs-page">
          <h1 style={{ textAlign: "center" }}>Manage Jobs & Internships</h1>
          <p className="page-subtitle" style={{ textAlign: "center" }}>Add and manage available opportunities</p>
          <div className="admin-form-box" style={{ textAlign: "left" }}>
            <h2>{editingJobId ? "Edit Job / Internship" : "Add New Job / Internship"}</h2>
            <form onSubmit={editingJobId ? updateJob : addJob}>
              <div className="form-grid">
                <div className="form-field">
                  <label>Job Title</label>
                  <input type="text" placeholder="Example: Software Developer" value={jobTitle} onChange={e => setJobTitle(e.target.value)} />
                </div>
                <div className="form-field">
                  <label>Company</label>
                  <input type="text" placeholder="Example: Amazon" value={jobCompany} onChange={e => setJobCompany(e.target.value)} />
                </div>
                <div className="form-field">
                  <label>Location</label>
                  <input type="text" placeholder="Example: Hyderabad" value={jobLocation} onChange={e => setJobLocation(e.target.value)} />
                </div>
                <div className="form-field">
                  <label>Type</label>
                  <select value={jobType} onChange={e => setJobType(e.target.value)}>
                    <option value="">Select Type</option>
                    <option value="Internship">Internship</option>
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>Salary / Stipend</label>
                  <input type="text" placeholder="Example: ₹15,000/month" value={jobSalary} onChange={e => setJobSalary(e.target.value)} />
                </div>
                <div className="form-field">
                  <label>Skills</label>
                  <input type="text" placeholder="Example: Python, SQL, React" value={jobSkills} onChange={e => setJobSkills(e.target.value)} />
                </div>
                <div className="form-field">
                  <label>Experience</label>
                  <input type="text" placeholder="Example: 0-2 years" value={jobExperience} onChange={e => setJobExperience(e.target.value)} />
                </div>
                <div className="form-field">
                  <label>Qualification</label>
                  <input type="text" placeholder="Example: B.Tech / B.E" value={jobQualification} onChange={e => setJobQualification(e.target.value)} />
                </div>
              </div>
              <div className="form-field">
                <label>Description</label>
                <textarea placeholder="Enter job description" value={jobDescription} onChange={e => setJobDescription(e.target.value)} rows="5" />
              </div>
              {editingJobId ? (
                <div>
                  <button type="submit" className="add-job-button">✏️ Update Job / Internship</button>
                  <button type="button" className="back-button" onClick={clearJobForm}>Cancel Edit</button>
                </div>
              ) : (
                <button type="submit" className="add-job-button">+ Add Job / Internship</button>
              )}
            </form>
          </div>

          <div className="existing-jobs">
            <h2>Existing Jobs & Internships</h2>
            {jobs.length === 0 ? (
              <div className="empty-box">No jobs available.</div>
            ) : (
              <div className="admin-job-list">
                {jobs.map(job => (
                  <div className="admin-job-card" key={job.id} style={{ textAlign: "left" }}>
                    <div className="admin-job-info">
                      <div className="admin-job-title">
                        <h2>{job.title}</h2>
                        <span className="job-type">{job.type}</span>
                      </div>
                      <h3>{job.company}</h3>
                      <p>📍 {job.location}</p>
                      <p>💰 {job.salary}</p>
                      <p>🛠 {job.skills}</p>
                      <p>🎓 <strong>Qualification:</strong> {job.qualification}</p>
                      <p>💼 <strong>Experience:</strong> {job.experience}</p>
                      <p>{job.description}</p>
                    </div>
                    <div>
                      <button className="edit-button" onClick={() => editJob(job)}>✏️ Edit</button>
                      <button className="delete-button" onClick={() => deleteJob(job.id)}>🗑 Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className="back-button" onClick={() => setPage("adminDashboard")}>← Back to Admin Dashboard</button>
        </div>
      </div>
    );
  }

  if (page === "adminApplications" && role === "ADMIN") {
    return (
      <div className="app">
        <nav className="navbar admin-navbar">
          <div className="logo">JobPortal Admin</div>
          <div className="nav-buttons">
            <button onClick={() => setPage("adminDashboard")}>Dashboard</button>
            <button onClick={openAdminJobs}>Manage Jobs</button>
            <button onClick={loadUsers}>Users</button>
            <button onClick={openAdminCompanyPaths}>Company Career Paths</button>
            <button onClick={logout}>Logout</button>
          </div>
        </nav>
        <div className="admin-applications-page">
          <h1 style={{ textAlign: "center" }}>Applications</h1>
          <p className="page-subtitle" style={{ textAlign: "center" }}>Manage applications submitted by users</p>

          {loadingApplicantDetails && (
            <div style={{ background: "#eff6ff", padding: "15px", borderRadius: "10px", marginBottom: "20px", textAlign: "center" }}>
              Loading applicant details...
            </div>
          )}

          {applications.length === 0 ? (
            <div className="empty-box">
              <h2>No Applications Yet</h2>
              <p>Applications submitted by users will appear here.</p>
            </div>
          ) : (
            <div className="admin-application-list">
              {applications.map(application => {
                const statusClass = application.status?.toLowerCase().replace(" ", "-");
                const applicant = applicantDetails[application.userId];

                return (
                  <div className="admin-application-card" key={application.id} style={{ padding: "25px", marginBottom: "25px", textAlign: "left" }}>
                    <div className="application-top" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "15px" }}>
                      <div>
                        <h2 style={{ margin: "0 0 6px 0" }}>Application #{application.id}</h2>
                        <p style={{ margin: "0" }}><strong>Job:</strong> {getJobTitle(application.jobId)}</p>
                      </div>
                      <span className={`status ${statusClass}`}>{application.status}</span>
                    </div>

                    <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "20px", marginTop: "20px" }}>
                      <h3 style={{ marginTop: "0", marginBottom: "15px" }}>👤 Applicant Details</h3>
                      {applicant ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <p style={{ margin: "0", lineHeight: "1.6" }}><strong>Name:</strong> {applicant.name}</p>
                          <p style={{ margin: "0", lineHeight: "1.6" }}><strong>Email:</strong> {applicant.email}</p>
                          <p style={{ margin: "0", lineHeight: "1.6" }}><strong>Phone:</strong> {applicant.phone}</p>
                          <p style={{ margin: "0", lineHeight: "1.6" }}><strong>Education:</strong> {applicant.education}</p>
                          <p style={{ margin: "0", lineHeight: "1.6" }}><strong>Skills:</strong> {applicant.skills}</p>
                          <p style={{ margin: "0", lineHeight: "1.6" }}><strong>Resume:</strong> {applicant.resume}</p>
                        </div>
                      ) : (
                        <p style={{ margin: "0" }}>Loading applicant information...</p>
                      )}
                    </div>

                    <div className="application-details" style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "20px" }}>
                      <p style={{ margin: "0", lineHeight: "1.6" }}><strong>User ID:</strong> {application.userId}</p>
                      <p style={{ margin: "0", lineHeight: "1.6" }}><strong>Job ID:</strong> {application.jobId}</p>
                      <p style={{ margin: "0", lineHeight: "1.6" }}><strong>Application ID:</strong> {application.id}</p>
                    </div>

                    <div className="application-actions" style={{ marginTop: "20px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                      <button className="resume-button" onClick={() => viewResume(application.userId)}>📄 View Resume</button>
                      <button className="shortlist-button" onClick={() => updateApplicationStatus(application.id, "SHORTLISTED")}>✓ Shortlist</button>
                      <button className="reject-button" onClick={() => updateApplicationStatus(application.id, "REJECTED")}>✕ Reject</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <button className="back-button" onClick={() => setPage("adminDashboard")}>← Back to Admin Dashboard</button>
        </div>
      </div>
    );
  }

  if (page === "adminUsers" && role === "ADMIN") {
    return (
      <div className="app">
        <nav className="navbar admin-navbar">
          <div className="logo">JobPortal Admin</div>
          <div className="nav-buttons">
            <button onClick={() => setPage("adminDashboard")}>Dashboard</button>
            <button onClick={openAdminJobs}>Manage Jobs</button>
            <button onClick={loadAdminApplications}>Applications</button>
            <button onClick={openAdminCompanyPaths}>Company Career Paths</button>
            <button onClick={logout}>Logout</button>
          </div>
        </nav>
        <div className="admin-users-page">
          <h1 style={{ textAlign: "center" }}>Registered Users</h1>
          <p className="page-subtitle" style={{ textAlign: "center" }}>View users registered in the JobPortal</p>
          {users.length === 0 ? (
            <div className="empty-box">
              <h2>No Users Found</h2>
              <p>No registered users are available.</p>
            </div>
          ) : (
            <div className="admin-user-list">
              {users.map(user => (
                <div className="admin-user-card" key={user.id} style={{ textAlign: "left" }}>
                  <div className="user-icon">👤</div>
                  <div className="user-details" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <h2 style={{ margin: "0 0 6px 0" }}>{user.name}</h2>
                    <p style={{ margin: "0", lineHeight: "1.6" }}><strong>User ID:</strong> {user.id}</p>
                    <p style={{ margin: "0", lineHeight: "1.6" }}><strong>Email:</strong> {user.email}</p>
                    <p style={{ margin: "0", lineHeight: "1.6" }}><strong>Role:</strong> <span className="user-role">{user.role}</span></p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button className="back-button" onClick={() => setPage("adminDashboard")}>← Back to Admin Dashboard</button>
        </div>
      </div>
    );
  }

  return null;
}

export default App;