
module.exports = {
    hourlySalary(monthly) {
	var lint = require('./doc/legal_interpretations.js');
	var obj = {
	    reference: [lint[0]],
	    value: monthly / 30 / 8,
	    rest: []
	};
	return obj;
    }
}
