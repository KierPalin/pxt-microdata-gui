// input.onButtonPressed(Button.B, function () {
//     y = Math.min(y + 10, 100)
// })
// let y = 0
// const app = new microcode.App();
// const calc = (arg0: microcode.GraphableFunction) => {
//     app.popScene()
//     app.pushScene(new microcode.LiveDataViewer(app, [arg0]))
// }
// const gf = new microcode.GraphableFunction((x) => y)
// const w = new microcode.Window({
//     app,
//     components: [
//         new microcode.GUIBox({
//             alignment: microcode.GUIComponentAlignment.TOP,
//             xOffset: 0,
//             yOffset: 0,
//             xScaling: 0.5,
//             yScaling: 0.3,
//             title: "Hello"
//         }),
//         // new microcode.GUIBox({
//         //     alignment: microcode.GUIComponentAlignment.LEFT,
//         //     xScaling: 0.8,
//         //     yScaling: 0.8,
//         //     colour: 4
//         // }),
//         new microcode.GUISlider({
//             alignment: microcode.GUIComponentAlignment.LEFT,
//             xScaling: 0.8,
//             yScaling: 0.8,
//             colour: 4
//         }),
//         new microcode.GUIGraph({
//             alignment: microcode.GUIComponentAlignment.RIGHT,
//             graphableFns: [gf],
//             xOffset: -5,
//             yOffset: 0,
//             xScaling: 1,
//             yScaling: 1,
//             colour: 6
//         }),
//         // new microcode.GUIBox({
//         //     alignment: microcode.GUIComponentAlignment.BOT,
//         //     xOffset: 0,
//         //     yOffset: 0,
//         //     xScaling: 0.6,
//         //     yScaling: 0.3,
//         //     colour: 7
//         // })
//     ]
// });
// app.pushScene(w)


const app = new microcode.App();

namespace microcode {
    export class W extends Scene {
        private comp: C[]
        private i: number

        constructor(app: App) {
            super(app)

            this.comp = [
                new C([new Button({ icon: "accelerometer", ariaId: "", x: 40, y: 0 })]),
                new C([new Button({ icon: "thermometer", ariaId: "", x: -40, y: 0 })])
            ]
            this.i = 0

            input.onButtonPressed(1, function () {
                this.i = (this.i + 1) % 2

            })

            // this.navigator.addButtons(this.comp[this.i].btns)
        }

        draw() {
            screen().fill(12)

            this.comp[this.i].draw()

            super.draw()
        }
    }

    class ButtonCollection {
        private btns: Button[][];
        private height: number;
        private widths: number[];

        private isHidden: boolean;

        private cursorBounds: Bounds;
        private cursorOutlineColour: number;
        private cursorRow: number;
        private cursorCol: number;

        constructor(opts: { btns: Button[][], isHidden: boolean, cursorColour: number }) {
            this.btns = opts.btns;
            this.isHidden = (opts.isHidden != null) ? opts.isHidden : false;

            this.height = this.btns.length
            this.widths = this.btns.map(row => row.length)

            this.cursorBounds = this.btns[0][0].bounds
            this.cursorOutlineColour = (opts.cursorColour != null) ? opts.cursorColour : 9 // Default is light blue
            this.cursorRow = 0;
            this.cursorCol = 0;

            this.bindShieldButtons()
        }

        bindShieldButtons() {
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.right.id,
                () => {
                    if (this.cursorCol == this.widths[this.cursorRow])
                        this.cursorCol = 0
                    else
                        this.cursorCol = (this.cursorCol + 1) % this.widths[this.cursorRow]
                    this.updateCursor()
                }
            )

            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.up.id,
                () => {
                    this.cursorRow = (((this.cursorRow - 1) % this.height) + this.height) % this.height; // Non-negative modulo

                    // Row above could have less cols, adjust if neccessary:
                    if (this.widths[this.cursorRow] <= this.cursorCol)
                        this.cursorCol = this.widths[this.cursorRow] - 1
                    this.updateCursor()
                }
            )

            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.down.id,
                () => {
                    this.cursorRow = (this.cursorRow + 1) % this.height;

                    // Row below could have less cols, adjust if neccessary:
                    if (this.widths[this.cursorRow] <= this.cursorCol)
                        this.cursorCol = this.widths[this.cursorRow] - 1
                    this.updateCursor()
                }
            )

            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.left.id,
                () => {
                    if (this.cursorCol == 0)
                        this.cursorCol = this.widths[this.cursorRow] - 1
                    else
                        this.cursorCol -= 1
                    this.updateCursor()
                }
            )

            // click
            const click = () => this.click()
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.A.id,
                click
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.A.id + keymap.PLAYER_OFFSET,
                click
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.B.id,
                () => this.back()
            )
        }

        click() {
            this.btns[this.cursorRow][this.cursorCol].onClick(this.btns[this.cursorRow][this.cursorCol])
        }

        back() {

        }


        updateCursor() {
            this.cursorBounds = this.btns[this.cursorRow][this.cursorCol].bounds;
            this.drawCursor()
        }

        drawCursor() {
            this.cursorBounds.drawRect(this.cursorOutlineColour)
        }

        draw() {
            if (!this.isHidden) {
                this.btns.forEach(btnRow => btnRow.forEach(btn => btn.draw()))

                this.drawCursor()
            }
        }
    }

    class C {
        public btns: Button[]

        constructor(btns: Button[]) {
            this.btns = btns
        }

        draw() {
            this.btns.forEach(btn => btn.draw())
        }
    }
}

app.pushScene(new microcode.W(app))