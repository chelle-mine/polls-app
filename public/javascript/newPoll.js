'use strict';

window.onload = function() {
    highlightHeader();

    const form = document.getElementById('newpoll-form');
    const inputWrapper = document.querySelector('.input-wrapper');
    const addOption = document.getElementById('clone');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const formStuff = new FormData(this);
        // verify form contents
        for (let item of formStuff.values()) {
            if (item.trim().length === 0) return window.alert('Please fill out any empty fields');
        }
        // make ajax request to /polls
        ajaxFns.ajaxRequest('POST', window.location.origin + '/polls', showLink, formStuff);
    });

    addOption.addEventListener('click', newOption);
    let options = 3;

    function showLink(data) {
        const parsed = JSON.parse(data);
        // alert user with required form fields
        if (typeof(parsed) === 'string') return window.alert(parsed);

        // update '.container'
        document.querySelector('.main-content').innerHTML = `Success! View your new poll  <a href="/polls/${parsed.link}" id="new-poll-link">here</a>`; 
    }

    function newOption() {
        // wrap new input group
        const newDiv = document.createElement('div');
        newDiv.setAttribute('class', 'btn-group-wrapper');
        // text input
        const newInput = document.querySelector('.option-input').cloneNode();
        newInput.classList.add('additional-opt');
        newInput.placeholder = 'Option ' + (options++);
        newInput.value = '';
        newInput.required = false;
        // delete button
        const newBtn = document.createElement('input');
        newBtn.type = 'button';
        newBtn.setAttribute('class', 'modify-btn remove-btn');
        newBtn.value = 'Delete';
        // delete button click listener
        newBtn.addEventListener('click', function(e) {
            const wrappers = Array.from(document.getElementsByClassName('btn-group-wrapper'));
            options = wrappers.indexOf(this.parentNode) + 3;
            // re-order any additional options after one being deleted
            if (wrappers.includes(this.parentNode.nextSibling)) {
                for (let i = wrappers.indexOf(this.parentNode.nextSibling); i < wrappers.length; i++) {
                    wrappers[i].firstChild.placeholder = 'Option ' + (options++);
                }
            } 
            this.parentNode.remove();
        });
        newDiv.appendChild(newBtn);
        newDiv.insertBefore(newInput, newBtn);
        inputWrapper.insertBefore(newDiv, addOption);
    }
};
