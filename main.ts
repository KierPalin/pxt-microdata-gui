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
    export class W extends CursorScene {
        private comp: C[]
        private i: number

        constructor(app: App) {
            super(app)

            this.navigator = new microcode.GridNavigator(1, 1)

            this.comp = [
                new C([new Button({ icon: "accelerometer", ariaId: "", x: 40, y: 0 })]),
                new C([new Button({ icon: "thermometer", ariaId: "", x: -40, y: 0 })])
            ]

            input.onButtonPressed(1, function () {
                this.i = (this.i + 1) % 2

                this.cursor = new microcode.Cursor()
                this.navigator = new microcode.GridNavigator(1, 1)
                this.cursor.navigator = this.navigator

                this.picker = new microcode.Picker(this.cursor)

                this.navigator.addButtons(this.comp[this.i].btns)


                basic.showNumber(3)
                basic.pause(1000)
            })

            this.i = 0

            this.navigator.addButtons(this.comp[this.i].btns)
        }

        draw() {
            screen().fill(12)

            this.comp[this.i].draw()

            super.draw()
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