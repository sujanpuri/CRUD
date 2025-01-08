import mongoose from "mongoose";

// Define the Student Schema
const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, // Removes whitespace
  },
  age:{
    type: Number,
    required: true,
    trim: true,
  },
  sex:{
    type: String,
    required: true,
    trim: true,
  },
  marks:{
    type: Number,
    required: true,
    trim: true,
  }
});

// Create a Student model from the schema
const Student = mongoose.model('Student', StudentSchema);

export default Student;