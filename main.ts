// let dataloggerSet = false;

// basic.forever(function () {
//     if (!dataloggerSet) {
//         dataloggerSet = true
//         control.inBackground(() => {
//             for (let i = 0; i < 10; i++) {
//                 datalogger.log(
//                     datalogger.createCV("i", i),
//                     datalogger.createCV("Sensor", i * 10),
//                 )
//                 basic.pause(1000)
//             }
//         })
//     }

//     screen().printCenter("" + datalogger.getNumberOfRows(), 10)
//     basic.pause(1000)
// })