'use strict';

function highlightHeader() {
    const path = window.location.pathname;
    document.querySelector('a[href="' + path + '"]').classList.add('nav-highlight');
}
