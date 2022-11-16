const cliProgress = require('cli-progress');
const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

Progress = { 

    start: (total) => {
        bar1.start(total, 0);
    },

    update: (current) => {
        bar1.update(current);
    },

    stop: () => {
        bar1.stop();
    }

}

module.exports = {
    Progress
}

// // start the progress bar with a total value of 200 and start value of 0
// bar1.start(200, 0);

// // increment every 100ms
// const timer = setInterval(function () {
//     bar1.increment();
//     // stop the progress bar if complete
//     if (bar1.value === bar1.getTotal()) {
//         clearInterval(timer);
//         bar1.stop();
//     }
// }, 100);
// }