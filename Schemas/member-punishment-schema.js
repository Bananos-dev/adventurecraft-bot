const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
	_id: {
		type: String,
		required: true,
	},
	seq: {
		type: Number,
		default: 0,
	},
});

counterSchema.static("increment", async function (counterName) {
	const count = await this.findByIdAndUpdate(
		counterName,
		{ $inc: { seq: 1 } },
		{ new: true, upsert: true }
	);
	return count.seq;
});

const CounterModel = mongoose.model("Counter", counterSchema);

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

memberPunishmentSchema.pre("save", async function () {
	if (!this.isNew) return;
	const inc = await CounterModel.increment("entity");
	this.id = inc;
});

module.exports = mongoose.model("memberPunishment", memberPunishmentSchema);
