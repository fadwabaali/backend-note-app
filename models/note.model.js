const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const noteSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    tags: {
        type: [String],
        default: [],
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdOn: {
        type: Date,
        default: new Date().getTime(),
    },
    modifiedOn: {
        type: Date,
        default: new Date().getTime(),
    },
    isPinned: {
        type: Boolean,
        default: false,
    }
})

module.exports = mongoose.model('Note', noteSchema);