const mongoose = require("mongoose");

const memberNoteSchema = new mongoose.Schema(
	{
		executedUserId: String,
		executedUserTag: String,
		targetUserId: String,
		targetUserTag: String,
		note: String,
	},
	{ timestamps: true }
);

module.exports = mongoose.model("memberNote", memberNoteSchema);
