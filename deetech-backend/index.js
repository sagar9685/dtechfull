const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db")


dotenv.config(); // Load environment variables

const app = express();
//const jobRouter = require('./routes/jobDescriptionRoutes');
const PORT = process.env.PORT || 3000; // Use PORT from .env if available

// Middlewares
app.use(express.json());
app.use(cors({
  origin:process.env.APP_URI
}));
app.use(morgan("dev"));

app.use("/api/auth", require("./routes/authroutes"));
app.use("/api/change", require("./routes/forgetchangepassroutes"));
app.use("/api", require("./routes/featureRoutes"));
app.use("/api/jobs", require("./routes/jobDescriptionRoutes"));
app.use("/api/jobs", require("./routes/userResumeProfileRoutes"));
app.use("/jobs", require("./routes/applyRoutes"));

// Define a route for the root path
app.get('/', (req, res) => {
  res.send('Hello, world! The server is running...');
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`.bgBlue.grey);
});

connectDB(process.env.MONGO_URL);