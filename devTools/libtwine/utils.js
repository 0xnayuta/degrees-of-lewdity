"use strict";
/*
 * Created by aimozg on 03.10.2022.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.noreturn = exports.array2sequence = exports.observedSequence = exports.filterSequence = exports.mapSequence = exports.sequenceUntil = exports.strsplice = exports.unescapeString = void 0;
/**
 * Unescape backslashes
 * @param {string} s
 * @return {string}
 */
function unescapeString(s) {
    return s.replace(/\\./g, (s) => s[1]);
}
exports.unescapeString = unescapeString;
function strsplice(s, startAt, delCount, replacement) {
    if (s == null) { // lazy equality for null
        throw new TypeError('strsplice called on null or undefined');
    }
    const length = s.length >>> 0;
    if (length === 0) {
        return '';
    }
    let start = Number(startAt);
    if (!Number.isSafeInteger(start)) {
        start = 0;
    }
    else if (start < 0) {
        start += length;
        if (start < 0) {
            start = 0;
        }
    }
    if (start > length) {
        start = length;
    }
    let count = Number(delCount);
    if (!Number.isSafeInteger(count) || count < 0) {
        count = 0;
    }
    let res = s.slice(0, start);
    if (typeof replacement !== 'undefined') {
        res += replacement;
    }
    if (start + count < length) {
        res += s.slice(start + count);
    }
    return res;
}
exports.strsplice = strsplice;
function* sequenceUntil(sequence, stopPredicate) {
    while (true) {
        let item = sequence.next();
        if (item.done)
            return;
        if (stopPredicate(item.value))
            return;
        yield item.value;
    }
}
exports.sequenceUntil = sequenceUntil;
function* mapSequence(sequence, map) {
    for (let item of sequence)
        yield map(item);
}
exports.mapSequence = mapSequence;
function* filterSequence(sequence, predicate) {
    for (let item of sequence)
        if (predicate(item))
            yield item;
}
exports.filterSequence = filterSequence;
function* observedSequence(sequence, observe) {
    for (let item of sequence) {
        observe(item);
        yield item;
    }
}
exports.observedSequence = observedSequence;
function* array2sequence(input) {
    for (let i of input)
        yield i;
}
exports.array2sequence = array2sequence;
/**
 * Wraps a sequenece that doesn't receive throw or return.
 * Thus, breaking out of the iteration loop does not close the sequence.
 *
 * @example
 *
 * let sequence = noreturn(sequence)
 *
 * for (item of sequence)
 *   if (test(item)) break;
 *
 * for (item of sequence) <- iteration continues here
 */
function noreturn(sequence) {
    return {
        [Symbol.iterator]() {
            const iterator = sequence[Symbol.iterator]();
            return {
                next: iterator.next.bind(iterator),
                return: null,
                throw: null
            };
        }
    };
}
exports.noreturn = noreturn;
//# sourceMappingURL=utils.js.map