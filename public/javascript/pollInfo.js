'use strict';

window.onload = function () {
    // submit btn fires ajax request
    document.querySelector('.form').addEventListener('submit', function(e) {
        e.preventDefault();
        const formStuff = new FormData(this);
        ajaxFns.ajaxRequest('POST', window.location.origin + window.location.pathname + '/vote', showResults, formStuff);
    });

    function showResults(data) {
        const options = JSON.parse(data).options;
        const totalVotes = options.reduce((acc, val) => acc + val.votes, 0);
        document.querySelector('.container').innerHTML = '<canvas id="chart-canvas" width="500" height="500"></canvas>';
        const canvas = document.getElementById('chart-canvas');
        const ctx = canvas.getContext('2d');
        const [width, height] = [500, 500];
        let beginAngle = 0;
        const colors = ['red', 'blue', 'green', 'cyan', 'magenta', 'yellow'];
        for (let i in options) {
            const sliceAngle = 2 * Math.PI * options[i].votes/totalVotes;
            drawPieSlice(
                    width/2,
                    height/2,
                    Math.min(width/2, height/2),
                    ctx,
                    beginAngle,
                    beginAngle + sliceAngle,
                    colors[i]
            );
            beginAngle += sliceAngle;
        }
    }

    function drawPieSlice(x, y, rad, ctx, startAngle, endAngle, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, rad, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();
    }

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

}

