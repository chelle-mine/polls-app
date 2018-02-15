'use strict';
const path = window.location.pathname;
console.log(path);
document.querySelector('a[href="' + path + '"]').classList.add('nav-highlight');
