'use strict';

(function() {
    const addBtn = document.querySelector('.btn-add');
    const deleteBtn = document.querySelector('.btn-delete');
    const clickNbr = document.querySelector('#click-nbr');
    const apiURL = appURL + '/api/:id/clicks';

    function updateClickCount(data) {
        // update <span> with 'clicks' property of found doc
        const clicksData = JSON.parse(data).clicks;
        clickNbr.innerHTML = clicksData >= 0 ? clicksData : data;
    }

    ajaxFns.ready(ajaxFns.ajaxRequest('GET', apiURL, updateClickCount));

    // addBtn updates clicks and retrieves updated value
    addBtn.addEventListener('click', function() {
        ajaxFns.ajaxRequest('POST', apiURL, updateClickCount);
    }, false);

    // deleteBtn resets clicks and retrieves updated value
    deleteBtn.addEventListener('click', function() {
        ajaxFns.ajaxRequest('DELETE', apiURL, updateClickCount);
    });

})();
