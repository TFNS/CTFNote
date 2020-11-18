export function colorHash(str) {
    let hash = 0;
    for (const c of str + 'TFNS') {
        hash = c.codePointAt(0) + ((hash << 5) - hash);
    }
    const hue = Math.floor(hash % 360);
    const color = `hsl(${hue}, 100%, 30%)`;
    return color;
}


export function sleep(t) {
    return new Promise(resolve => setTimeout(resolve, t))
}

export function showErrors(vm, errors) {
    if (errors) {
        console.log(errors)
        for (const error of errors) {
            vm.$q.notify({
                type: "negative",
                position: "top",
                message: error.msg,
            });
        }
    }
}

function pad(s, size, padding = " ") {
    return (padding.repeat(size) + s).substr(-size)
}

export function getDate(date) {
    const y = date.getFullYear()
    const m = pad(date.getMonth() + 1, 2, "0")
    const d = pad(date.getDate(), 2, "0")
    return `${y}/${m}/${d}`;
}
export function getTime(date) {
    const h = pad(date.getHours(), 2, "0")
    const m = pad(date.getMinutes(), 2, "0")
    return `${h}:${m}`;
}

export function getDateTime(date) {
    return `${getDate(date)} ${getTime(date)}`
}