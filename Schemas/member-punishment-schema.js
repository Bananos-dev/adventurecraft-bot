const mongoose = require("mongoose");

const memberPunishmentSchema = new mongoose.Schema(
	{
		action: {
			type: String,
			enum: ["ban", "timeout", "kick", "warn"],
		},
		executedUserId: String,
		executedUserTag: String,
		targetUserId: String,
		targetUserTag: String,
		duration: {
			type: Number,
			default: 0,
		},
		durationUnit: {
			type: String,
			default: "",
		},
		validUntil: {
			type: Date,
			default: () => new Date(),
		},
		reason: String,
		status: { type: String, enum: ["completed", "active", "expired"] },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("memberPunishment", memberPunishmentSchema);
