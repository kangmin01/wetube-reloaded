import mongoose from "mongoose";

mongoose.set("strictQuery", true);
mongoose.connect(
  "mongodb+srv://mini:plzcomeon@cluster0.aqlxcmk.mongodb.net/test"
);

const db = mongoose.connection;

const handleError = (error) => console.log("❌ DB error", error);
const handleOpen = () => console.log("☑️ Connected to DB");

db.on("error", handleError);
db.once("open", handleOpen);
