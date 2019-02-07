import {iterateCursor} from "./utils.js";

export default class QueryTarget {
	constructor(target) {
		this._target = target;
	}

	reduce(range, reducer, initialValue) {
		return this._reduce(range, reducer, initialValue, "next");
	}

	reduceReverse(range, reducer, initialValue) {
		return this._reduce(range, reducer, initialValue, "next");
	}
	
	selectLimit(range, amount) {
		return this._selectLimit(range, amount, "next");
	}

	selectLimitReverse(range, amount) {
		return this._selectLimit(range, amount, "prev");
	}

	selectWhile(range, predicate) {
		return this._selectWhile(range, predicate, "next");
	}

	selectWhileReverse(range, predicate) {
		return this._selectWhile(range, predicate, "prev");
	}

	selectAll(range) {
		const cursor = this._target.openCursor(range, direction);
		const results = [];
		return iterateCursor(cursor, (value) => {
			results.push(value);
			return true;
		});
	}

	selectFirst(range) {
		return this._find(range, () => true, "next");
	}

	selectLast(range) {
		return this._find(range, () => true, "prev");
	}

	find(range, predicate) {
		return this._find(range, predicate, "next");
	}

	findReverse(range, predicate) {
		return this._find(range, predicate, "prev");
	}

	_reduce(range, reducer, initialValue, direction) {
		let reducedValue = initialValue;
		const cursor = this._target.openCursor(range, direction);
		return iterateCursor(cursor, (value) => {
			reducedValue = reducer(reducedValue, value);
			return true;
		});
	}

	_selectLimit(range, amount, direction) {
		return this._selectWhile(range, (results) => {
			return results.length === amount;
		}, direction);
	}

	_selectWhile(range, predicate, direction) {
		const cursor = this._target.openCursor(range, direction);
		const results = [];
		return iterateCursor(cursor, (value) => {
			results.push(value);
			return predicate(results);
		});
	}

	async _find(range, predicate, direction) {
		const cursor = this._target.openCursor(range, direction);
		let result;
		const found = await iterateCursor(cursor, (value) => {
			const found = predicate(value);
			if (found) {
				result = value;
			}
			return found;
		});
		if (found) {
			return result;
		}
	}
}