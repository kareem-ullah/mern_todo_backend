// const mongoose = require('mongoose')

// const todoSchema = new mongoose.Schema({
//     task: {
//         type: String,
//         required: true,
//     }
// })
// const TodoModel = mongoose.model('todos', todoSchema)
// module.exports = TodoModel




const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }
});

const TodoModel = mongoose.model('todos', todoSchema);
module.exports = TodoModel;