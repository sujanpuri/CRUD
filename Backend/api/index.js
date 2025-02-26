import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Student from "../model/schema.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:3000", "https://your-frontend-domain.vercel.app"], // Allow specific origins
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  credentials: true, // Allow credentials if necessary (cookies, auth headers, etc.)
}));

// Database Connection
const connect = async () => {
  try {
    console.log("Connecting to the DataBase...");
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connected to the DataBase");
  } catch (err) {
    console.error("Database connection error:", err.message);
  }
};
connect();

// Routes
app.get("/", (req, res) => {
  res.send("This is the backend server Page of Student Data");
});

// Add Student  (CREATE operation)
app.post("/add-student", async (req, res) => {
  try {
    const { name, age, sex, marks } = req.body; //get data from frontend (request)

    if (!name || !age || !marks) {
      return res
        .status(400)
        .json({ error: "Name, Age, and Marks are required." });
    }

    const std = new Student({
      //create new student
      name,
      age,
      sex: sex || "Male", // Default value for sex is Male
      marks,
    });

    await std.save(); //save new student data to database
    console.log("Student Added Successfully");
    res.status(201).json({ message: "Student Added Successfully." }); //alert message
  } catch (err) {
    console.error("Error adding student:", err.message);
    res.status(500).json({ error: "Failed to add student." });
  }
});

// Get Students     (READ operation)
app.get("/get-student", async (req, res) => {
  try {
    const studentData = await Student.find(); //fetch all student data from database
    res.status(200).json(studentData); //send data to frontend
  } catch (err) {
    console.error("Error fetching students:", err.message);
    res.status(500).json({ error: "Failed to fetch students." });
  }
});

// Update a student by ID (Update operation)
app.put("/update-student/:id", async (req, res) => {
  const { id } = req.params;
  const { name, age, sex, marks } = req.body;

  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { name, age, sex, marks },
      { new: true } // Return the updated document
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    res
      .status(200)
      .json({ message: "Student updated successfully", updatedStudent });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error updating student", error: err.message });
  }
});

// Delete a student by ID (DELETE operation)
app.delete("/delete-student/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error("Error deleting student:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(3300);
export default app;
