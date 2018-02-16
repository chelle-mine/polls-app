'use strict';

// viewing results
function viewResults(data, parentNode) {
    const poll = JSON.stringify(data);
    drawChart(poll, parentNode);
    const goBack = document.createElement('a');
    goBack.setAttribute('href', '/my-polls');
    goBack.id = 'back-link';
    goBack.innerHTML = '&larr; Back to my polls';
    parentNode.appendChild(goBack);
}

window.onload = function() {
    highlightHeader();
    // delete functionality
    const deleteBtns = document.getElementsByClassName('remove-btn');
    for (let i = 0; i < deleteBtns.length; i++) {
        deleteBtns[i].addEventListener('click', function(e) {
            if (window.confirm('Delete poll "' + this.previousSibling.previousSibling.innerText + '"?')) {
                ajaxFns.ajaxRequest('DELETE', window.location.origin + '/polls/' + this.name, () => {
                    this.parentNode.parentNode.remove();
                });
            }
        });
    }
}
