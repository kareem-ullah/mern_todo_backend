const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const TodoModel = require("./Models/Todo");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/todo");

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});
mongoose.connection.on("error", (err) => {
  console.log("Error connecting to MongoDB:", err);
});
mongoose.connection.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
});

////////////get all todos ////////////

app.get("/getTodos", (req, res) => {
  TodoModel.find()
    .then((todos) => res.json(todos))
    .catch((err) => res.status(500).json({ error: "Failed to fetch todos" }));
});

/////////////add todo ////////////

app.post("/add", (req, res) => {
  console.log("Body:", req.body);
  console.log("Task:", req.body.task);

  if (!req.body.task) {
    return res.status(400).json({ error: "Task is missing!" });
  }

  TodoModel.create({ task: req.body.task })
    .then((result) => res.json(result))
    .catch((err) => {
      console.error("Error saving to DB:", err);
      res.status(500).json({ error: "Failed to save task" });
    });
});

/////////////delete todo ////////////

app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  TodoModel.findByIdAndDelete(id)
    .then((result) => res.json({ success: true }))
    .catch((err) => res.status(500).json({ error: err.message }));
});


app.put('/update/:id', (req, res) => {
    const taskId = req.params.id;
    const updatedTask = req.body.task;

    if (!updatedTask) {
        return res.status(400).json({ error: 'Task content is required' });
    }


    TodoModel.findByIdAndUpdate(taskId, { task: updatedTask }, { new: true })
        .then(updatedTodo => {
            res.json(updatedTodo);
        })
        .catch(err => {
            console.error("Error updating todo:", err);
            res.status(500).json({ error: 'Failed to update task' });
        });
});


app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
