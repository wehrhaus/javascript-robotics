(function () {

    const five = require('johnny-five');
    const temporal = require('temporal');


    const leftWheelPin = 9;
    const rightWheelPin = 8;
    const servoType = 'continuous';

    const opts = {};
    opts.port = process.argv[2] || '';

    const board = new five.Board(opts);

    board.on('ready', function () {

        const wheel = {
            left: new five.Servo({
                type: servoType,
                pin: leftWheelPin
            }),
            right: new five.Servo({
                type: servoType,
                pin: rightWheelPin,
                invert: true // sync with left
            }),
            forwardDirection: 'ccw',
            reverseDirection: 'cw'
        };

        const rightWheelForward = () => wheel.right[wheel.forwardDirection]();
        const leftWheelForward = () => wheel.left[wheel.forwardDirection]();
        const rightWheelReverse = () => wheel.right[wheel.reverseDirection]();
        const leftWheelReverse = () => wheel.left[wheel.reverseDirection]();

        const wheelsForward = () => {
            rightWheelForward();
            leftWheelForward();
        };

        const wheelsReverse = () => {
            rightWheelReverse();
            leftWheelReverse();
        };

        const spinLeft = () => {
            wheel.left[wheel.reverseDirection]();
            wheel.right[wheel.forwardDirection]();
        };

        const spinRight = () => {
            wheel.left[wheel.forwardDirection]();
            wheel.right[wheel.reverseDirection]();
        };

        const stopWheels = () => {
            wheel.left.stop();
            wheel.right.stop();
        };

        process.on('exit', (code) => {
            stopWheels();
            console.log('Exiting with code:', code);
        });

        temporal.queue([
            {
                delay: 500,
                task: () => {
                    console.log('Both wheels forward');
                    wheelsForward();
                }
            },
            {
                delay: 1000,
                task: () => {
                    console.log('Both wheels reverse');
                    wheelsReverse();
                }
            },
            {
                delay: 1000,
                task: () => {
                    console.log('Spin Left');
                    spinLeft();
                }
            },
            {
                delay: 1000,
                task: () => {
                    console.log('Spin RIght');
                    spinRight();
                }
            },
            {
                delay: 1000,
                task: () => {
                    console.log('Stop Wheels');
                    wheel.left.to(87);
                    wheel.right.to(90);
                }
            },
            {
                delay: 500,
                task: () => {
                    process.exit(0);
                }
            }
        ]);

    });

}());
