'use strict';

(function() {
    // profile and index
    const profileId = document.querySelector('#profile-id') || null;
    const profileUsername = document.querySelector('#profile-username') || null;
    const profileRepos = document.querySelector('#profile-repos') || null;
    // index only
    const displayName = document.querySelector('#display-name');
    const apiURL = appURL + '/api/:id';

    function updateHTMLElement(data, element, userProp) {
        element.innerHTML = data[userProp];
    }

    ajaxFns.ready(ajaxFns.ajaxRequest('GET', apiURL, (data) => {
        const userObj = JSON.parse(data);

        updateHTMLElement(userObj, displayName, 'displayName');

        if (profileId !== null) updateHTMLElement(userObj, profileId, 'id');

        if (profileUsername !== null) updateHTMLElement(userObj, profileUsername, 'username');

        if (profileRepos !== null) updateHTMLElement(userObj, profileRepos, 'publicRepos');
    }));

})();
