function numerize(obj) {
    if (obj === null) return obj;
    if (obj === undefined) return obj;
    if (typeof obj === "string") {
        if (!obj) return obj;
        // skip starting with non-digit ("+", "-", etc.)
        if (/[\D]/.test(obj.substr(0, 1))) return obj;
        // skip starting with zero without point f.e. "02"
        if (/^0[^.]/.test(obj.substr(0, 2))) return obj;
        const num = Number(obj);
        if (!isNaN(num)) return num;
    }

    if (typeof obj === "object") {
        Object.keys(obj).forEach(key => { 
            obj[key] = numerize(obj[key]);
        })
    }

    return obj;

}



module.exports = numerize;
