const mongoose = require("mongoose");

const memberNoteSchema = new mongoose.Schema(
	{
		executedUserId: String,
		userId: String,
		note: String,
	},
	{ timestamps: true }
);

module.exports = mongoose.model("memberNote", memberNoteSchema);
