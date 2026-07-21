import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

export const EditJob = () => {
  const { updateJob } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const job = location.state;

  const [title, setTitle] = useState(job?.title || "");
  const [locationName, setLocationName] = useState(job?.location || "");
  const [type, setType] = useState(job?.type || job?.jobType || "Full-time");
  const [salary, setSalary] = useState(job?.salary || "");
  const [category, setCategory] = useState(job?.category || "Software Development");
  const [experience, setExperience] = useState(job?.experience || "1-3 years");
  const [skills, setSkills] = useState(
    job?.skills ? job.skills.join(", ") : ""
  );
  const [description, setDescription] = useState(job?.description || "");

//update job
  const handleUpdateJob = async (e) => {
    e.preventDefault();

    const updatedJob = {
      title,
      location: locationName,
      jobType: type,
      salary,
      category,
      experience,
      skills: skills.split(",").map(skill => skill.trim()),
      description
    };

    try {
      await updateJob(id, updatedJob);

      await Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Job updated successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/dashboard");

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          error.response?.data?.message ||
          "Unable to update job.",
      });
    }
  };


  if (!job) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold">
          Job data not found
        </h2>
      </div>
    );
  }


  return (
    <div className="max-w-4xl mx-auto px-6 py-10">

      <div className="glass-card p-8 rounded-2xl border">

        <h1 className="text-2xl font-bold mb-6">
          Edit Job
        </h1>


        <form
          onSubmit={handleUpdateJob}
          className="space-y-5"
        >

          <input
            type="text"
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
            placeholder="Job Title"
            className="w-full px-4 py-3 border rounded-xl"
          />


          <input
            type="text"
            value={locationName}
            onChange={(e)=>setLocationName(e.target.value)}
            placeholder="Location"
            className="w-full px-4 py-3 border rounded-xl"
          />


          <select
            value={type}
            onChange={(e)=>setType(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl"
          >
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Remote</option>
            <option>Contract</option>
          </select>


          <input
            type="text"
            value={salary}
            onChange={(e)=>setSalary(e.target.value)}
            placeholder="Salary"
            className="w-full px-4 py-3 border rounded-xl"
          />


          <input
            type="text"
            value={category}
            onChange={(e)=>setCategory(e.target.value)}
            placeholder="Category"
            className="w-full px-4 py-3 border rounded-xl"
          />


          <input
            type="text"
            value={experience}
            onChange={(e)=>setExperience(e.target.value)}
            placeholder="Experience"
            className="w-full px-4 py-3 border rounded-xl"
          />


          <input
            type="text"
            value={skills}
            onChange={(e)=>setSkills(e.target.value)}
            placeholder="Skills (comma separated)"
            className="w-full px-4 py-3 border rounded-xl"
          />


          <textarea
            rows="5"
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
            placeholder="Job Description"
            className="w-full px-4 py-3 border rounded-xl"
          />


          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700"
          >
            Save Changes
          </button>

        </form>

      </div>

    </div>
  );
};