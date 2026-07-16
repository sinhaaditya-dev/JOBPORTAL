const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const User = require("./src/models/User");
const authRoutes = require("./src/routes/authRoutes");
const jobRoutes = require("./src/routes/jobRoutes");
const applicationRoutes = require("./src/routes/applicationRoutes");

dotenv.config();

const app = express();

connectDB();


app.get("/", (req, res) => {
  res.send("Backend running");
});
//middleware
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

