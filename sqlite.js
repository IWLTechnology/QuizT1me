
const fs = require("fs");
const dbFile = "./.data/highscores.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const dbWrapper = require("sqlite");
let db;

dbWrapper
	.open({
		filename: dbFile,
		driver: sqlite3.Database
	})
	.then(async dBase => {
		db = dBase;

		try {
			if (!exists) {
				await db.run(
					"CREATE TABLE Highscores (id INTEGER PRIMARY KEY AUTOINCREMENT, time TEXT, name TEXT, correct TEXT)"
				);
			} else {

			}
		} catch (dbError) {
			console.error(dbError);
		}
	});

module.exports = {
	getHighscores: async () => {
		try {
			return await db.all("SELECT * from Highscores");
		} catch (dbError) {
			console.error(dbError);
		}
	},

	addHighscore: async data => {
		try {
			return await db.all(`INSERT INTO Highscores (time, name, correct) VALUES ('${data.time}', '${data.name}', '${data.correct}')`);

		} catch (dbError) {
			// Database connection error
			console.error(dbError);
		}
	},
};
