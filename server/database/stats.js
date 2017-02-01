const HOURS_IN_DAY = 24;
const MINS_IN_HOUR = 60;

var weekday = ["Mon", "Tue", "Wed", "Thu", "Fri"];
var weekend = ["Sat", "Sun"];

var peak_times = [9, 17];
var mid_day = [10, 11, 12, 13, 14, 15, 16];
var off_peak = [6, 8, 18, 19, 20, 21, 22, 23, 0, 1, 2, 3, 4, 5];

var general = [13, 15, 19, 20, 21];
var game_time = [18, 20, 22];

var short_durations = [5, 7, 10, 12, 15, 18, 20, 23, 25, 30, 40, 50];
var long_durations = [60, 70, 90, 100, 110, 120, 150, 180];

/* Constructor definition */
function stat() {
	/* Initialise the module */
	this.enter_time = {
		day: null,
		hour: null,
		minute: null
	};
	this.exit_time = {
		day: null,
		hour: null,
		minute: null
	};
}

stat.prototype.selector = function (list) {
	var cumulative = 0;
	var random = Math.random();

	for (k = 0; k < list.length; k++) {
		cumulative += list[k].probability;
		if (random < cumulative) {
			return k;
		}
	}
};

stat.prototype.time_entrance = function (location) {
	var days = [];
	var hours = [];
	if (location != 'Waterloo') {
		/* Bin days */
		days.push({
			value: weekday,
			probability: 0.2
		});
		days.push({
			value: weekend,
			probability: 0.8
		});
		/* Bin hours */
		hours.push({
			value: general,
			probability: 0.1
		});
		hours.push({
			value: game_time,
			probability: 0.9
		});
	} else {
		/* Bin days */
		days.push({
			value: weekend,
			probability: 0.2
		});
		days.push({
			value: weekday,
			probability: 0.8
		});
		/* Bin hours */
		hours.push({
			value: off_peak,
			probability: 0.1
		});
		hours.push({
			value: mid_day,
			probability: 0.2
		});
		hours.push({
			value: peak_times,
			probability: 0.7
		});
	}
	var hour_pool = hours[this.selector(hours)].value;
	var day_pool = days[this.selector(days)].value;

	this.enter_time = {
		day: day_pool[Math.floor(Math.random() * day_pool.length)],
		hour: hour_pool[Math.floor(Math.random() * hour_pool.length)],
		minute: Math.round(Math.random() * (MINS_IN_HOUR - 1))
	};
	return this.enter_time;
};

stat.prototype.time_exit = function (location) {
	/* Copy the entrance time */
	this.exit_time.minute = this.enter_time.minute;
	this.exit_time.hour = this.enter_time.hour;
	this.exit_time.day = this.enter_time.day;

	if (location != "Waterloo") {
		var duration = long_durations[Math.floor(Math.random() *
																							long_durations.length)];
	} else {
		var duration = short_durations[Math.floor(Math.random() *
																							short_durations.length)];
	}
	this.exit_time.minute += duration;

	while (this.exit_time.minute >= MINS_IN_HOUR) {
		this.exit_time.minute -= MINS_IN_HOUR;
		this.exit_time.hour++;

		if (this.exit_time.hour >= HOURS_IN_DAY) {
			//this.exit_time.day++;
			this.exit_time.hour -= HOURS_IN_DAY;
			//FIXME: This is going to overflow according to Murphy's Law
		}
	}
	return this.exit_time;
};

module.exports = stat;
