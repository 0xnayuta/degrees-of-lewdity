const Town = (() => {
	// Duration is in days
	// Cost is in £
	const projectSetup = {
		bridge: { duration: 14, cost: 15000 },
		road: { duration: 14, cost: 25000 },
		fieldOffice: { duration: 12, cost: 30000 },
		thicket: { duration: 7, cost: 50000 },
		green: { duration: 4, cost: 10000 },
	};

	const projectsObj = key => ({
		get dateFinished() {
			return V.town.projects[key]?.dateFinished ?? 0;
		},
		set dateFinished(value) {
			V.town.projects[key].dateFinished = value;
		},
		get stage() {
			return V.town.projects[key]?.stage ?? 0;
		},
		set stage(value) {
			V.town.projects[key].stage = value;
		},
		get isUnderConstruction() {
			return Time.date.timeStamp < V.town.projects[key]?.dateFinished;
		},
		get isComplete() {
			return Time.date.timeStamp >= V.town.projects[key]?.dateFinished;
		},
		get isCompletionDay() {
			const finished = new DateTime(V.town.projects[key].dateFinished);
			return !!(finished && Time.date.dayDifference(finished) === 0);
		},
		get duration() {
			return projectSetup[key].duration;
		},
		get cost() {
			return projectSetup[key].cost;
		},
		complete() {
			V.town.projects[key].stage = 4;
			V.town.projects[key].dateFinished = Time.date.timeStamp;
		},
	});

	const projects = Object.fromEntries(Object.keys(projectSetup).map(name => [name, projectsObj(name)]));

	return { projects };
})();
window.Town = Town;
