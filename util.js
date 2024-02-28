var _ = {};

_.isArray = function (arr) {
    return Array.isArray(arr);
}

_.isElement = function (obj) {
    try {
        return obj instanceof HTMLElement;
    } catch (e) {
        return (typeof obj === "object") && (obj.nodeType === 1) && (typeof obj.style === "object") && (typeof obj.ownerDocument === "object");
    }
}

_.isFunction = function (functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

_.isObject = function (item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

_.randomString = function (count, chars) {
    var chars = chars || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        result = '',
        length = chars.length;
    for (let i = 0; i < count; i++) {
        result += chars.charAt(Math.floor(Math.random() * length));
    }
    return result;
}

_.mergeDeep = function (target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();
    if (_.isObject(target) && _.isObject(source)) {
        for (const key in source) {
            if (_.isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                _.mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }
    return _.mergeDeep(target, ...sources);
}

_.delay = function (delayInms) {
    return new Promise(resolve => setTimeout(resolve, delayInms));
}

_.offset = function (el) {
    var rect = el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

_.getPosition = function (element) {
    return { x: _.offset(element).left, y: _.offset(element).top };
}

_.formatDate = function (time, fmt) {
    time = new Date(time);
    var o = {
        "M+": time.getMonth() + 1,
        "d+": time.getDate(),
        "h+": time.getHours(),
        "m+": time.getMinutes(),
        "s+": time.getSeconds(),
        "q+": Math.floor((time.getMonth() + 3) / 3),
        "S": time.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    } return fmt;
}

_.setCookie = function (name, value, daysTolive) {
    let cookie = name + "=" + encodeURIComponent(value);
    if (typeof daysTolive === "number") cookie += "; max-age =" + (daysTolive * 60 * 60 * 24); document.cookie = cookie;
}

_.getCookie = function (name) {
    let arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) return unescape(arr[2]);
    return null;
}

_.toCamelCase = function (value) {
    return value.replace(/-(\w)/g, (matched, letter) => {
        return letter.toUpperCase();
    });
}