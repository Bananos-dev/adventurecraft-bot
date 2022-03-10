const memberPunishmentSchema = require("../Schemas/member-punishment-schema");

async function startWarningCheckService() {
	await updateWarnings();

	// run every 12 hours
	setInterval(() => {
		updateWarnings();
	}, 3.6e6 * 12);
}

async function updateWarnings() {
	try {
		await memberPunishmentSchema.updateMany(
			{ status: "expired" },
			{
				$and: [
					{ action: "warn" },
					{ status: "active" },
					{
						validUntil: {
							$lt: new Date().toISOString(),
						},
					},
				],
			},
			{ multi: true }
		);
	} catch (e) {
		console.log(e);
	}
}

module.exports = {
	startWarningCheckService,
};
