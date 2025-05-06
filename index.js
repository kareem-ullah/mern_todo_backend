// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// const TodoModel = require("./Models/Todo");
// const UserModel = require("./Models/User");
// const authMiddleware = require("./Middleware/auth");

// const app = express();
// app.use(cors());
// app.use(express.json());

// // mongoose.connect("mongodb://127.0.0.1:27017/todo");
// mongoose.connect(
// //   "mongodb+srv://todo-app:3352375@cluster0.ukc7tpd.mongodb.net/todo",
//   "mongodb+srv://todo-app:3352375@cluster0.ukc7tpd.mongodb.net/todo?retryWrites=true&w=majority"
// );
// // const mongoURI = "mongodb+srv://<username>:<password>@cluster0.mongodb.net/myDatabase?retryWrites=true&w=majority";

// // --- AUTH ROUTES ---

// // Register
// app.post("/register", async (req, res) => {
//   const { email, password } = req.body;
//   const hashedPassword = await bcrypt.hash(password, 10);
//   try {
//     const user = await UserModel.create({ email, password: hashedPassword });
//     res.json(user);
//   } catch (error) {
//     res.status(400).json({ error: "User already exists" });
//   }
// });

// // Login
// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   const user = await UserModel.findOne({ email });
//   if (!user) return res.status(400).json({ error: "User not found" });

//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

//   const token = jwt.sign({ id: user._id }, "yourSecretKey", {
//     expiresIn: "1h",
//   });
//   res.json({ token });
// });

// // --- TODO ROUTES ---

// // Get user-specific todos
// app.get("/getTodos", authMiddleware, async (req, res) => {
//   try {
//     const todos = await TodoModel.find({ userId: req.user.id });
//     res.json(todos);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch todos" });
//   }
// });

// /// Add new todo
// app.post("/add", authMiddleware, async (req, res) => {
//   const { task } = req.body;
//   if (!task) {
//     return res.status(400).json({ error: "Task is missing!" });
//   }
//   try {
//     const newTodo = await TodoModel.create({ task, userId: req.user.id });
//     res.json(newTodo);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to save task" });
//   }
// });

// /// Delete todo
// app.delete("/delete/:id", authMiddleware, async (req, res) => {
//   const id = req.params.id;
//   try {
//     await TodoModel.findOneAndDelete({ _id: id, userId: req.user.id });
//     res.json({ success: true });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// /// Update todo
// app.put("/update/:id", authMiddleware, async (req, res) => {
//   const taskId = req.params.id;
//   const { task } = req.body;

//   if (!task) {
//     return res.status(400).json({ error: "Task content is required" });
//   }

//   try {
//     const updatedTodo = await TodoModel.findOneAndUpdate(
//       { _id: taskId, userId: req.user.id },
//       { task },
//       { new: true }
//     );
//     res.json(updatedTodo);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to update task" });
//   }
// });

// /// Update todo
// app.get("/heartbeat", async (req, res) => {
//   res.json({ message: "Server is running" });
// });

// app.listen(3001, () => {
//   console.log("✅ Server is running on port 3001");
// });


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const TodoModel = require("./Models/Todo");
const UserModel = require("./Models/User");
const authMiddleware = require("./Middleware/auth");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(
  process.env.MONGODB_URI || "mongodb+srv://todo-app:3352375@cluster0.ukc7tpd.mongodb.net/todo?retryWrites=true&w=majority"
)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.log("❌ MongoDB connection error:", err);
    process.exit(1); // Exit process if DB connection fails
  });

// --- AUTH ROUTES ---

// Register
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await UserModel.create({ email, password: hashedPassword });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: "User already exists" });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) return res.status(400).json({ error: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, "yourSecretKey", {
    expiresIn: "1h",
  });
  res.json({ token });
});

// --- TODO ROUTES ---

// Get user-specific todos
app.get("/getTodos", authMiddleware, async (req, res) => {
  try {
    const todos = await TodoModel.find({ userId: req.user.id });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

// Add new todo
// app.post("/add", authMiddleware, async (req, res) => {
//   const { task } = req.body;
//   if (!task) {
//     return res.status(400).json({ error: "Task is missing!" });
//   }
//   try {
//     const newTodo = await TodoModel.create({ task, userId: req.user.id });
//     res.json(newTodo);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to save task" });
//   }
// });


app.post("/add", authMiddleware, async (req, res) => {
  const { task } = req.body;
  
  if (!task) {
    return res.status(400).json({ error: "Task is missing!" });
  }
  
  try {
    const newTodo = await TodoModel.create({ task, userId: req.user.id });
    res.json(newTodo);
  } catch (err) {
    console.error("Error while adding task:", err);  // Error ko log karna zaroori hai
    res.status(500).json({ error: "Failed to save task" });
  }
});

// Delete todo
app.delete("/delete/:id", authMiddleware, async (req, res) => {
  const id = req.params.id;
  try {
    await TodoModel.findOneAndDelete({ _id: id, userId: req.user.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update todo
app.put("/update/:id", authMiddleware, async (req, res) => {
  const taskId = req.params.id;
  const { task } = req.body;

  if (!task) {
    return res.status(400).json({ error: "Task content is required" });
  }

  try {
    const updatedTodo = await TodoModel.findOneAndUpdate(
      { _id: taskId, userId: req.user.id },
      { task },
      { new: true }
    );
    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ error: "Failed to update task" });
  }
});

// Heartbeat route
app.get("/heartbeat", async (req, res) => {
  res.json({ message: "Server is running" });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
