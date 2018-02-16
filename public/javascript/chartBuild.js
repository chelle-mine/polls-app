'use strict';

function drawChart(poll, parentNode) {
    const parsedPoll = JSON.parse(poll);
    console.log(poll);
    console.log(parsedPoll);
    const choices = parsedPoll.options;
    const names = choices.map((choice) => choice.name);
    const votes = choices.map((choice) => choice.votes);
    

    // populate parentNode with canvas and draw chart
    parentNode.innerHTML = '';
    // poll title
    const title = document.createElement('h2');
    title.class = 'page-title';
    title.innerText = parsedPoll.question;
    parentNode.appendChild(title);
    // in case of no votes yet
    if (votes.reduce((acc, val) => acc + val, 0) === 0) {
        const p = document.createElement('p');
        p.innerText = 'No votes here!';
        return parentNode.appendChild(p);
    } 
    // chart canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'chart-canvas';
    canvas.width = 320;
    canvas.height = 320;
    parentNode.appendChild(canvas);
    // draw chart in canvas
    const ctx = document.getElementById('chart-canvas').getContext('2d');
    const donutChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: names,
            datasets: [{
                label: '# of Votes',
                data: votes,
                backgroundColor: genRandomColors(names.length)
            }]
        },
        options: {
            responsive: false
        }
    });

    function genRandomColors(num) {
        let colors = [];
        for (let i = 0; i < num; i++) {
            colors.push(
                'rgba(' 
                + Math.floor(Math.random() * 250)
                + ','
                + Math.floor(Math.random() * 250)
                + ','
                + Math.floor(Math.random() * 250)
                + ','
                + (Math.random() + 0.2).toFixed(1)
                + ')'
            )
        }
        return colors;
    }
}
