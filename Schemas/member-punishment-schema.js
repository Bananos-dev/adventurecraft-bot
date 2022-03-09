const mongoose = require("mongoose");

const memberPunishmentSchema = new mongoose.Schema(
	{
		id: { type: Number, default: 0 },
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

memberPunishmentSchema.pre("save", function (next) {
	var doc = this;
	counter.findByIdAndUpdate(
		{ _id: "entityId" },
		{ $inc: { id: 1 } },
		function (error, counter) {
			if (error) return next(error);
			doc.testvalue = counter.seq;
			next();
		}
	);
});

module.exports = mongoose.model("memberPunishment", memberPunishmentSchema);
