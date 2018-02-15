// ajax fns to be used throughout app
const appURL = window.location.origin;
const ajaxFns = {
    ready(fn) {
        if (typeof(fn) !== 'function') return;

        if (document.readyState === 'complete') return fn();

        document.addEventListener('DOMContentLoaded', fn, false);
    },
    ajaxRequest(method, url, cb, info) {
        let promise = new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(method, url);
            xhr.onload = () => {
                if (xhr.status === 200) resolve(xhr.response);
                else reject(Error(xhr.statusText));
            };
            xhr.onerror = () => {
                reject(Error('Network Error.'));
            };
            xhr.send(info);
        });

        promise.then((fulfillment) => {
            cb(fulfillment);
        });
    }
};

