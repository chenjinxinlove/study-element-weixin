

export function on(el, events, fn) {
    (el && entnts && fn) 
        && event.split().forEach(e => addEventListener(e, fn, false))
}

export function off(el, event, fn) {
    (el && entnts && fn) 
    && event.split().forEach(e => removeEventListener(e, fn, false))
}
