import "dotenv/config";
import "./db.js";
import "./models/Video";
import "./models/User";
import "./models/Comment";
import app from "./server.js";

const PORT = 4000;

const handleListening = () =>
  console.log(`✅ Server listening on port http://localhost:${PORT} 🚀`);

app.listen(4000, handleListening);
