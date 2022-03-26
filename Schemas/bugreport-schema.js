const mongoose = require("mongoose");

const bugCounterSchema = new mongoose.Schema({
	_id: {
		type: String,
		required: true,
	},
	seq: {
		type: Number,
		default: 1,
	},
});

bugCounterSchema.static("increment", async function (counterName) {
	const count = await this.findByIdAndUpdate(
		counterName,
		{ $inc: { seq: 1 } },
		{ new: true, upsert: true }
	);
	return count.seq;
});

const CounterModel = mongoose.model("bugCounter", bugCounterSchema);

const bugreportSchema = new mongoose.Schema(
	{
        id: { type: Number, default: 0 },
		time: String,
        userId: String,
        content: String,
		status: String,
	},
	{ timestamps: false }
);
bugreportSchema.pre("save", async function () {
	if (!this.isNew) return;
	const inc = await CounterModel.increment("entity");
	this.id = inc;
});

module.exports = mongoose.model("bugReport", bugreportSchema);
