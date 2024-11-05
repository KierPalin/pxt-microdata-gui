const app = new microcode.App();
const calc = (arg0: microcode.GraphableFunction) => {
    app.popScene()
    app.pushScene(new microcode.LiveDataViewer(app, [arg0]))
}
// const w = new microcode.Window({
//     app,
//     components: [
//         new microcode.GUITestComponent({
//             alignment: microcode.GUIComponentAlignment.TOP,
//             xOffset: 0,
//             yOffset: 4,
//             scaling: 0.3
//         }),
//         new microcode.GUITestComponent({
//             alignment: microcode.GUIComponentAlignment.LEFT,
//             xOffset: 3,
//             yOffset: 0,
//             scaling: 0.8,
//             colour: 4
//         }),
//         new microcode.GUITestComponent({
//             alignment: microcode.GUIComponentAlignment.RIGHT,
//             xOffset: 3,
//             yOffset: 0,
//             scaling: 0.5,
//             colour: 5
//         }),
//         new microcode.GUITestComponent({
//             alignment: microcode.GUIComponentAlignment.CENTRE,
//             xOffset: 0,
//             yOffset: 0,
//             scaling: 0.6,
//             colour: 6
//         }),
//         new microcode.GUITestComponent({
//             alignment: microcode.GUIComponentAlignment.BOT,
//             xOffset: 0,
//             yOffset: 0,
//             scaling: 0.6,
//             colour: 7
//         })
//     ]
// });
// app.pushScene(w)

namespace microcode {
    export class A extends CursorSceneWithPriorPage {
        private btns: Button[]

        constructor(app: App) {
            super(app, () => {}, new GridNavigator(3, 4))

            this.btns = []
        }

        /* override */ startup() {
            super.startup()

            let x = -40;
            let y = -30;

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 4; j++) {
                    this.btns.push(new Button({
                        parent: null,
                        style: ButtonStyles.Transparent,
                        icon: "green_tick",
                        ariaId: "Done",
                        x,
                        y,
                        onClick: () => {}
                    }))
                    x += screen().width / 4
                }
                y += screen().height / 3
            }
        }

        draw() {
            Screen.fillRect(
                Screen.LEFT_EDGE,
                Screen.TOP_EDGE,
                Screen.WIDTH,
                Screen.HEIGHT,
                0xc
            )

            screen().printCenter("Sensor Selection", 2)

            for (let i = 0; i < this.btns.length; i++)
                this.btns[i].draw()

            super.draw()
        }
    }
}

app.pushScene(new microcode.A(app))