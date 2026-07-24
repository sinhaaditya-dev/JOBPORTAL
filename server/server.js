const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const connectDB = require("./src/config/db");
const User = require("./src/models/User");
const authRoutes = require("./src/routes/authRoutes");
const jobRoutes = require("./src/routes/jobRoutes");
const applicationRoutes = require("./src/routes/applicationRoutes");
const userRoutes = require("./src/routes/userRoutes");
const dashboardRotes = require("./src/routes/dashboardRotes")
const studentDashboardRoutes = require("./src/routes/studentDashboardRoutes")
const profilePictureRoutes = require('./src/routes/profilePictureRoutes')
const cloudinary = require("./src/config/cloudinary");

const app = express();


connectDB();


app.get("/", (req, res) => {
  res.send("Backend running");
});
const cors = require("cors");


app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
//middleware
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard",dashboardRotes);
app.use("/api/dashboard/student",studentDashboardRoutes)
app.use("/api/profile", profilePictureRoutes)
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

