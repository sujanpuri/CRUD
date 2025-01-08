import React, { useState, useEffect } from "react";
import axios from "axios";

const StdApp = () => {
  const [Std, setStd] = useState({
    // State for adding Student Details
    name: "",
    age: "",
    sex: "",
    marks: "",
  });

  const [StudentData, setStudentData] = useState([]); // State for fetching Student Details
  const [editId, setEditId] = useState(null); // Track the ID of the student being edited

  useEffect(() => {
    // Fetch Student Data from Database
    const fetchStd = async () => {
      try {
        const response = await axios.get("https://sujanbackend-l14jhp63v-ankit-khanals-projects.vercel.app/get-student"); //axios get request (to fetch data)
        setStudentData(response.data); //set data to SetStudentData state
      } catch (err) {
        console.error("Error fetching student data:", err.message);
      }
    };

    fetchStd();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      // Update existing student
      try {
        await axios.put(`https://crud-std-backend.vercel.app/update-student/${editId}`, Std); // Send PUT request
        alert("Student updated successfully!");

        // Fetch updated data
        const updatedList = await axios.get(
          "https://crud-std-backend.vercel.app/get-student"
        );
        setStudentData(updatedList.data);

        setEditId(null); // Reset editId
        setStd({ name: "", age: "", sex: "", marks: "" }); // Clear form
      } catch (err) {
        console.error("Error updating student:", err.message);
      }
    } else {
      // Add new student
      try {
        await axios.post("https://crud-std-backend.vercel.app/add-student", Std);
        alert("Student added successfully!");

        // Fetch updated data
        const updatedList = await axios.get(
          "https://crud-std-backend.vercel.app/get-student"
        );
        setStudentData(updatedList.data);

        setStd({ name: "", age: "", sex: "", marks: "" }); // Clear form
      } catch (err) {
        console.error("Error adding student:", err.message);
      }
    }
  };

  const handleChange = (e) => {
    setStd({
      ...Std, //let new data to be added to the existing data
      [e.target.name]: e.target.value, //e.target.name specifies the field & e.target.value change the value to user input
    });
  };

  const handleEdit = (student) => {
    setStd({
      name: student.name,
      age: student.age,
      sex: student.sex,
      marks: student.marks,
    });
    setEditId(student._id); // Save the ID of the student being edited
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      console.log(id);
      await axios.delete(`https://crud-std-backend.vercel.app/delete-student/${id}`);
      alert("Student deleted successfully!");

      // Update the UI after deletion
      setStudentData((prev) =>
        prev.filter((studentData) => studentData._id !== id)
      );
    } catch (err) {
      console.error("Error deleting student:", err.message);
    }
  };

  return (
    <div className="min-h-screen bg-green-100 p-8">
      <h1 className="text-3xl font-bold text-center text-green-600 mb-8">
        Add Student Details
      </h1>

      {/* Form Section */}
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto border-[1px] border-green-600 bg-green-50 shadow-md rounded-lg p-6 mb-12"
      >
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 mb-1">Name:</label>
            <input
              type="text"
              name="name"
              value={Std.name}
              onChange={handleChange}
              placeholder="Enter student name"
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 mb-1">Age:</label>
            <input
              type="number"
              name="age"
              value={Std.age}
              onChange={handleChange}
              placeholder="Enter age"
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 mb-1">Sex:</label>
            <select
              name="sex"
              value={Std.sex}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 mb-1">Marks:</label>
            <input
              type="number"
              name="marks"
              value={Std.marks}
              onChange={handleChange}
              placeholder="Enter marks"
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white font-medium py-2 mt-4 rounded-md hover:bg-green-700 transition"
        >
          Add Student
        </button>
      </form>

      {/* Table Section */}
      <div className="max-w-4xl mx-auto border-[1px] border-green-600 bg-green-50 shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
          Student Details in Database
        </h2>
        <table className="w-full border border-gray-300">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Age</th>
              <th className="py-2 px-4 text-left">Sex</th>
              <th className="py-2 px-4 text-left">Marks</th>
              <th className="py-2 px-4 text-left">Edit</th>
              <th className="py-2 px-4 text-left">Delete</th>
            </tr>
          </thead>
          <tbody>
            {StudentData.length > 0 ? (
              StudentData.map((std, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-green-50" : "bg-white"
                  } border-b`}
                >
                  <td className="py-2 px-4">{std.name}</td>
                  <td className="py-2 px-4">{std.age}</td>
                  <td className="py-2 px-4">{std.sex}</td>
                  <td className="py-2 px-4">{std.marks}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(std)} // Pass the student object to handleEdit
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                    >
                      Edit
                    </button>
                  </td>
                  <td>
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                      onClick={() => {
                        handleDelete(std._id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-4 text-gray-600 italic"
                >
                  No Student Data Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StdApp;
