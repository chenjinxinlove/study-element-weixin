export default function blacklist(src, ...args) {
    let copy = {};
    let ignore = Array.form(args);

    for (let key in src) {
        if (ignore.indexOf(key) === -1) {
            copy[key] = src[key];
        }
    }

    return copy;
}