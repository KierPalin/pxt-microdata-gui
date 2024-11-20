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
        private btnCollections: ButtonCollection[]
        private i: number

        constructor(app: App) {
            super(app)

            this.btnCollections = [
                // new C([new Button({ icon: "accelerometer", ariaId: "", x: 40, y: 0 })]),
                // new C([new Button({ icon: "thermometer", ariaId: "", x: -40, y: 0 })])
                new ButtonCollection({
                    btns: [
                        [new Button({ icon: "accelerometer", ariaId: "", x: 40, y: 0, onClick: () => basic.showNumber(0) })],
                        [new Button({ icon: "accelerometer", ariaId: "", x: 40, y: 20, onClick: () => basic.showNumber(1) })]
                    ],
                    isActive: true,
                }),
                new ButtonCollection({
                    btns: [
                        [new Button({ icon: "thermometer", ariaId: "", x: -40, y: 0, onClick: () => basic.showNumber(2) })],
                        [new Button({ icon: "thermometer", ariaId: "", x: -40, y: 20, onClick: () => basic.showNumber(3) })]
                    ],
                    isActive: false,
                    isHidden: false
                }),
            ]
            this.i = 1

            input.onButtonPressed(1, function () {
                this.toggleActiveBtnComponent()
            })

            // this.navigator.addButtons(this.comp[this.i].btns)
        }

        toggleActiveBtnComponent() {
            this.i = (this.i + 1) % 2

            this.btnCollections.forEach(btnC => btnC.hide())
            this.btnCollections[this.i].unHide()
            this.btnCollections[this.i].bindShieldButtons()
        }

        draw() {
            screen().fill(12)

            // this.comp[this.i].draw()

            this.btnCollections.forEach(btnC => btnC.draw())

            super.draw()
        }
    }

    class ButtonCollection {
        private btns: Button[][];
        private height: number;
        private widths: number[];

        private isActive: boolean;
        private isHidden: boolean;

        private cursorBounds: Bounds;
        private cursorOutlineColour: number;
        private cursorRow: number;
        private cursorCol: number;

        constructor(opts: { btns: Button[][], isActive: boolean, isHidden?: boolean, cursorColour?: number }) {
            this.btns = opts.btns;

            this.isActive = opts.isActive
            this.isHidden = (opts.isHidden != null) ? opts.isHidden : false;

            this.height = this.btns.length
            this.widths = this.btns.map(row => row.length)

            this.cursorBounds = new Bounds({
                width: this.btns[0][0].width + 4,
                height: this.btns[0][0].height + 4,
                left: this.btns[0][0].xfrm.localPos.x - (this.btns[0][0].width / 2) - 2,
                top: this.btns[0][0].xfrm.localPos.y - (this.btns[0][0].height / 2) - 2
            })
            this.cursorOutlineColour = (opts.cursorColour != null) ? opts.cursorColour : 9; // Default is light blue
            this.cursorRow = 0;
            this.cursorCol = 0;

            if (this.isActive)
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

                    // Row above might have less cols, adjust if neccessary:
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

                    // Row below might have less cols, adjust if neccessary:
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

        hide() {
            this.isHidden = true;
        }

        unHide() {
            this.isHidden = false;
        }

        click() {
            this.btns[this.cursorRow][this.cursorCol].onClick(this.btns[this.cursorRow][this.cursorCol])
        }

        back() {

        }

        updateCursor() {
            this.cursorBounds = new Bounds({
                width: this.btns[0][0].width + 4,
                height: this.btns[0][0].height + 4,
                left: this.btns[0][0].xfrm.localPos.x - (this.btns[0][0].width / 2) - 2,
                top: this.btns[0][0].xfrm.localPos.y - (this.btns[0][0].height / 2) - 2
            })
            this.drawCursor()
        }

        drawCursor() {
            this.cursorBounds.fillRect(this.cursorOutlineColour)
        }

        drawCursorText() {
            const ariaId = this.btns[this.cursorRow][this.cursorCol].ariaId
            const text = accessibility.ariaToTooltip(ariaId)

            if (text) {
                const pos = this.cursorBounds;
                const n = text.length
                const font = microcode.font
                const w = font.charWidth * n
                const h = font.charHeight
                const x = Math.max(
                    Screen.LEFT_EDGE + 1,
                    Math.min(Screen.RIGHT_EDGE - 1 - w, pos.left + (pos.width >> 1) - (w >> 1))
                )
                const y = Math.min(
                    pos.top + (pos.height) + 1,
                    Screen.BOTTOM_EDGE - 1 - font.charHeight
                )
                Screen.fillRect(x - 1, y - 1, w + 1, h + 2, 15)
                Screen.print(text, x, y, 1, font)
            }
        }

        draw() {
            if (this.isActive) {
                this.drawCursor()
            }

            if (!this.isHidden) {
                this.btns.forEach(btnRow => btnRow.forEach(btn => btn.draw()))
            }

            if (this.isActive) {
                this.drawCursorText()
            }
        }
    }

    // class C {
    //     public btns: Button[]

    //     constructor(btns: Button[]) {
    //         this.btns = btns
    //     }

    //     draw() {
    //         this.btns.forEach(btn => btn.draw())
    //     }
    // }
}

app.pushScene(new microcode.W(app))