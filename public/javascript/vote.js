'use strict';

window.onload = function(){
    const container = document.querySelector('.main-content');
    // submit btn fires ajax request
    document.querySelector('.form').addEventListener('submit', function(e) {
        e.preventDefault();
        const formStuff = new FormData(this);
        ajaxFns.ajaxRequest('POST', window.location.origin + window.location.pathname + '/vote', (data) => {
            drawChart(data, container);
            const goBack = document.createElement('a');
            goBack.setAttribute('href', '/polls');
            goBack.id = 'back-link';
            goBack.innerHTML = '&larr; Back to polls';
            container.appendChild(goBack);
        }, formStuff);
    });
    
    // radio buttons
    const customText = document.querySelector('#custom-text');
    const rads = document.getElementsByName('option');
    rads[0].checked = true;

    if (customText === null) return;

    for (let i = 0; i < rads.length; i++) {
        rads[i].addEventListener('click', function() {
            if (this.id === 'custom-radio') {
                customText.disabled = false;
                customText.focus();
            }
            else customText.disabled = true;
        });
    }
};

