

export function on(el, events, fn) {
    (el && events && fn) 
        && events.split().forEach(e => addEventListener(e, fn, false))
}

export function off(el, events, fn) {
    (el && events && fn) 
    && events.split().forEach(e => removeEventListener(e, fn, false))
}
