import "regenerator-runtime";
import "dotenv/config";
// require("dotenv").config();
import "./db.js";
import "./models/Video";
import "./models/User";
import "./models/Comment";
import app from "./server.js";

const PORT = process.env.PORT || 4000;

const handleListening = () =>
  console.log(`✅ Server listening on port http://localhost:${PORT} 🚀`);

app.listen(3000, "0.0.0.0", handleListening);
