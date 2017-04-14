
module.exports = {
    hourlySalary(monthly) {
	var obj = {
	    reference: require('./reference.js'),
	    value: monthly / 30 / 8,
	    rest: []
	};
	return obj;
    }
}
