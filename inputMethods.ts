namespace microcode {
    abstract class AbstractInputMethod extends Scene {
        protected titleText: string;

        upBtnPressed() { }
        downBtnPressed() { }
        leftBtnPressed() { }
        rightBtnPressed() { }
        aBtnPressed() { }
        bBtnPressed() { }

        draw() {
            screen().fillRect(0, 0, screen().width, screen().height, this.backgroundColor)

            screen().printCenter(this.titleText, 4)
        }
    }

    export class TickerMenu extends AbstractInputMethod {
        private tickerValues: number[];
        private tickerIncrements: number[];
        private currentTickerIndex: number;

        private next: (arg0: number[]) => void;
        private back: () => void;

        constructor(
            app: App,
            titleText: string,
            defaultTickerValues: number[],
            backgroundColor?: number,
            next?: (arg0: number[]) => void,
            back?: () => void,
        ) {
            super(app, "TickerMenu")

            this.backgroundColor = (backgroundColor != null) ? backgroundColor : 3;

            this.titleText = titleText;

            this.tickerValues = defaultTickerValues;
            this.tickerIncrements = this.tickerValues.map(_ => 1)
            this.currentTickerIndex = 0;

            this.next = next;
            this.back = back;

            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.left.id,
                () => this.leftBtnPressed()
            )

            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.right.id,
                () => this.rightBtnPressed()
            )

            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.up.id,
                () => this.upBtnPressed()
            )

            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.down.id,
                () => this.downBtnPressed()
            )

            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.A.id,
                () => this.aBtnPressed()
            )

            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.B.id,
                () => this.bBtnPressed()
            )
        }

        upBtnPressed() {
            let tick = true;
            control.onEvent(
                ControllerButtonEvent.Released,
                controller.up.id,
                () => tick = false
            )
            while (tick) {
                this.tickerValues[this.currentTickerIndex] += 1
                basic.pause(100)
            }
            control.onEvent(ControllerButtonEvent.Released, controller.up.id, () => { })
        }

        downBtnPressed() {
            let tick = true;
            control.onEvent(
                ControllerButtonEvent.Released,
                controller.down.id,
                () => tick = false
            )
            while (tick) {
                this.tickerValues[this.currentTickerIndex] -= 1
                basic.pause(100)
            }
            control.onEvent(ControllerButtonEvent.Released, controller.down.id, () => { })
        }

        leftBtnPressed() {
            this.currentTickerIndex = (((this.currentTickerIndex - 1) % this.tickerIncrements.length) + this.tickerIncrements.length) % this.tickerIncrements.length
        }

        rightBtnPressed() {
            this.currentTickerIndex = (this.currentTickerIndex + 1) % this.tickerIncrements.length;
        }

        aBtnPressed() {
            if (this.next != null)
                this.next(this.tickerValues)
        }

        bBtnPressed() {
            if (this.back != null)
                this.back()
        }

        draw() {
            super.draw()

            const xDiff = screen().width / (this.tickerValues.length + 1)

            for (let i = 0; i < this.tickerValues.length; i++) {
                const value: string = "" + this.tickerValues[i];
                screen().print(
                    value,
                    ((i + 1) * xDiff) - 3,
                    screen().height / 2,
                    0
                )

                screen().fillTriangle(
                    ((i + 1) * xDiff) - 4,
                    (screen().height / 2) - 2,
                    ((i + 1) * xDiff) - 4 + (font.charWidth * value.length + 1) + 1,
                    (screen().height / 2) - 2,
                    ((i + 1) * xDiff) - 4 + ((font.charWidth * value.length + 1) / 2) + 1,
                    (screen().height / 2) - 7,
                    5
                )

                screen().fillTriangle(
                    ((i + 1) * xDiff) - 4,
                    (screen().height / 2) + 9,
                    ((i + 1) * xDiff) - 4 + (font.charWidth * value.length + 1) + 1,
                    (screen().height / 2) + 9,
                    ((i + 1) * xDiff) - 4 + ((font.charWidth * value.length + 1) / 2) + 1,
                    (screen().height / 2) + 14,
                    5
                )
            }
        }
    }


    const KEYBOARD_FRAME_COUNTER_CURSOR_ON = 20;
    const KEYBOARD_FRAME_COUNTER_CURSOR_OFF = 40;

    export class KeyboardMenu extends CursorSceneWithPriorPage {
        private static WIDTHS: number[] = [10, 10, 10, 10, 4]
        private btns: Button[]
        private btnText: string[]
        private text: string;
        private upperCase: boolean;
        private next: (arg0: string) => void
        private frameCounter: number;

        constructor(app: App, next: (arg0: string) => void) {
            super(app, function () {}, new GridNavigator(5, 5, KeyboardMenu.WIDTHS))//, new GridNavigator(5, 10))
            this.text = ""
            this.upperCase = true

            this.btns = []
            this.btnText = [
                "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
                "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
                "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
                "U", "V", "W", "X", "Y", "Z", ",", ".", "?", "!",
                "<-", "^", " _______ ", "ENTER"
            ];

            this.next = next
            this.frameCounter = 0;
        }

        /* override */ startup() {
            super.startup()

            const defaultBehaviour = (btn: Button) => {
                this.text += this.btnText[btn.state[0]]
                this.frameCounter = KEYBOARD_FRAME_COUNTER_CURSOR_ON
            }

            for (let i = 0; i < 4; i++) {
                const xDiff = screen().width / (KeyboardMenu.WIDTHS[i] + 1);
                for (let j = 0; j < 10; j++) {
                    this.btns.push(
                        new Button({
                            parent: null,
                            style: ButtonStyles.Transparent,
                            icon: bitmaps.create(10, 10),
                            ariaId: "",
                            x: (xDiff * (j + 1)) - (screen().width / 2),
                            y: (13 * (i + 1)) - 18,
                            onClick: defaultBehaviour,
                            state: [(i * 10) + j]
                        })
                    )
                }
            }

            const botRowBehaviours = [
                (btn: Button) => { 
                    this.text = (this.text.length > 0) ? this.text.substr(0, this.text.length - 1) : this.text
                    this.frameCounter = KEYBOARD_FRAME_COUNTER_CURSOR_ON
                },
                (btn: Button) => { this.changeCase() },
                (btn: Button) => { this.text += " "; this.frameCounter = KEYBOARD_FRAME_COUNTER_CURSOR_ON},
                (btn: Button) => { this.next(this.text) }
            ]

            const icons = [bitmaps.create(16, 10), bitmaps.create(10, 10), bitmaps.create(55, 10), bitmaps.create(33, 10)]
            const x = [22, 38, 74, 124]
            for (let i = 0; i < 4; i++) {
                this.btns.push(
                    new Button({
                        parent: null,
                        style: ButtonStyles.Transparent,
                        icon: icons[i],
                        ariaId: "",
                        x: x[i] - (screen().width / 2),
                        y: (13 * 5) - 18,
                        onClick: botRowBehaviours[i]
                    })
                )
            }

            this.changeCase()
            this.navigator.addButtons(this.btns)
        }

        private changeCase() {
            this.upperCase = !this.upperCase;

            if (this.upperCase)
                this.btnText = this.btnText.map((btn, i) => 
                    btn = (i < 40) ? btn.toUpperCase() : btn
                )
            else
                this.btnText = this.btnText.map((btn, i) => 
                    btn = (i < 40) ? btn.toLowerCase() : btn
                )
        }

        draw() {
            this.frameCounter += 1

            Screen.fillRect(
                Screen.LEFT_EDGE,
                Screen.TOP_EDGE,
                Screen.WIDTH,
                41,
                6
            )

            Screen.fillRect(
                Screen.LEFT_EDGE + 3,
                Screen.TOP_EDGE + 4,
                Screen.WIDTH - 7,
                34,
                15
            )

            Screen.fillRect(
                Screen.LEFT_EDGE + 6,
                Screen.TOP_EDGE + 6,
                Screen.WIDTH - 12,
                32,
                1
            )

            screen().printCenter(this.text, 17, 15)

            if (this.frameCounter >= KEYBOARD_FRAME_COUNTER_CURSOR_ON) {
                screen().print(
                    "_",
                    (screen().width / 2) + ((this.text.length * bitmaps.font8.charWidth) / 2),
                    17,
                    15
                )
                
                if (this.frameCounter >= KEYBOARD_FRAME_COUNTER_CURSOR_OFF)
                    this.frameCounter = 0
            }


            Screen.fillRect(
                Screen.LEFT_EDGE,
                Screen.TOP_EDGE + 41,
                Screen.WIDTH,
                Screen.HEIGHT,
                6
            )

            Screen.fillRect(
                Screen.LEFT_EDGE + 4,
                Screen.TOP_EDGE + 47,
                Screen.WIDTH - 6,
                71,
                15
            )

            Screen.fillRect(
                Screen.LEFT_EDGE + 4,
                Screen.TOP_EDGE + 44,
                Screen.WIDTH - 8,
                72,
                4
            )

            for (let i = 0; i < this.btns.length; i++) {
                this.btns[i].draw()

                const x = (screen().width / 2) + this.btns[i].xfrm.localPos.x - (this.btns[i].icon.width / 2) + 2
                const y = (screen().height / 2) + this.btns[i].xfrm.localPos.y + font.charHeight - 12
                screen().print(this.btnText[i], x, y)
            }

            super.draw()
        }
    }

    type simpleFN = (x: number, val: number) => number;

    export class CalculatorMenu extends CursorSceneWithPriorPage {
        private btns: Button[]
        private btnText: string[]
        private text: string;
        private next: (arg0: GraphableFunction) => void
        private btnToFnNames: string[]

        constructor(app: App, next: (arg0: GraphableFunction) => void) {
            super(app, function () { }, new GridNavigator(2, 10))
            this.text = ""

            this.btns = []
            this.btnText = [
                "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
                "x", "+", "-", "/", "*", "s", "c", "t", " ", "D"
            ];

            this.btnToFnNames = [
                "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
                "x", "+", "-", "/", "*", "sin", "cos", "tan", " ", "D"
            ]

            this.next = next
        }

        /* override */ startup() {
            super.startup()

            const btnsPerRow = 10;
            const xDiff = screen().width / (btnsPerRow + 1);

            const defaultBehaviour = (btn: Button) => {
                this.text += this.btnToFnNames[btn.state[0]] + " "
            }

            const behaviours = []
            for (let i = 0; i < 19; i++) {
                behaviours.push(defaultBehaviour)
            }
            behaviours.push(
                (btn: Button) => {
                    const expression = "3 * sin x"
                    const tokens = this.text.split(' '); // this.text
                    const variableName = 'x'

                    // for (let i = 0; i < tokens.length; i++) {
                    //     basic.showString(tokens[i])
                    // }

                    const f = (x: number): number => {
                        let result = 0;
                        let currentOperation = '=';

                        for (let i = 0; i < tokens.length - 1; i++) {
                            const token = tokens[i]
                            if (!isNaN(+token)) {
                                const num = +token;
                                result = performOperation(result, num, currentOperation);
                            } else if (token === 'x') {
                                result = performOperation(result, x, currentOperation);
                            } else if (token === 'sin') {
                                result = performOperation(result, x, 'sin');
                            } else if (token === 'cos') {
                                result = performOperation(result, x, 'cos');
                            } else if (token === 'tan') {
                                result = performOperation(result, x, 'tan');
                            } else {
                                currentOperation = token;
                            }
                        }

                        return result;
                    };

                    // Function to perform the operations
                    function performOperation(a: number, b: number, operation: string): number {
                        switch (operation) {
                            case '=':
                                return a;
                            case '+':
                                return a + b;
                            case '-':
                                return a - b;
                            case '*':
                                return a * b;
                            case '/':
                                return a / b;
                            case 'sin':
                                return Math.sin(b);
                            case 'cos':
                                return Math.cos(b);
                            case 'tan':
                                return Math.tan(b);
                            default:
                                return b;
                        }
                    }

                    this.next(new GraphableFunction(f))
                }
            )

            for (let i = 0; i < 2; i++) {
                for (let j = 0; j < 10; j++) {
                    this.btns.push(
                        new Button({
                            parent: null,
                            style: ButtonStyles.Transparent,
                            icon: bitmaps.create(10, 10),
                            ariaId: "",
                            x: xDiff * (j + 1) - (screen().width / 2),
                            y: (12 * (i + 1)) - 20,
                            onClick: behaviours[(i * 10) + j],
                            state: [(i * 10) + j]
                        })
                    )
                }
            }

            this.navigator.addButtons(this.btns)
        }

        draw() {
            Screen.fillRect(
                Screen.LEFT_EDGE,
                Screen.TOP_EDGE,
                Screen.WIDTH,
                Screen.HEIGHT,
                12
            )

            screen().printCenter(this.text, 5)

            for (let i = 0; i < this.btns.length; i++) {
                this.btns[i].draw()
                const x = (screen().width / 2) + this.btns[i].xfrm.localPos.x - (this.btnText[i].length * font.charWidth) + 3
                const y = (screen().height / 2) + this.btns[i].xfrm.localPos.y - (this.btnText[i].length * font.charHeight)
                screen().print(this.btnText[i], x, y)
            }

            super.draw()
        }
    }

    export class CallbackMenu extends AbstractInputMethod {

    }
}