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

// namespace microcode {
//     export class W extends Scene {
//         private btnCollections: ButtonCollection[]
//         private i: number

//         constructor(app: App) {
//             super(app)

//             this.btnCollections = [
//                 new ButtonCollection({
//                     btns: [
//                         [new Button({ icon: "accelerometer", ariaId: "", x: 40, y: 0, onClick: () => basic.showNumber(0) }),
//                         new Button({ icon: "accelerometer", ariaId: "", x: 20, y: 0, onClick: () => basic.showNumber(6)})],
//                         [new Button({ icon: "accelerometer", ariaId: "", x: 40, y: 20, onClick: () => basic.showNumber(1) })]
//                     ],
//                     isActive: true,
//                 }),
//                 new ButtonCollection({
//                     btns: [
//                         [new Button({ icon: "thermometer", ariaId: "", x: -40, y: 0, onClick: () => basic.showNumber(2) })],
//                         [new Button({ icon: "thermometer", ariaId: "", x: -40, y: 20, onClick: () => basic.showNumber(3) })]
//                     ],
//                     isActive: false,
//                     isHidden: false
//                 }),
//             ]
//             this.i = 0

//             input.onButtonPressed(1, function () {
//                 this.toggleActiveBtnComponent()
//             })

//             // this.navigator.addButtons(this.comp[this.i].btns)
//         }

//         toggleActiveBtnComponent() {
//             this.i = (this.i + 1) % 2

//             this.btnCollections.forEach(btnC => { btnC.hide(); btnC.unmakeActive() })
//             this.btnCollections[this.i].unHide()
//             this.btnCollections[this.i].makeActive()
//         }

//         draw() {
//             screen().fill(12)

//             // this.comp[this.i].draw()

//             this.btnCollections.forEach(btnC => btnC.draw())

//             super.draw()
//         }
//     }
// }

// app.pushScene(new microcode.W(app))

const comp1 = new microcode.ButtonCollection({
    alignment: microcode.GUIComponentAlignment.TOP,
    btns: [
        [new microcode.Button({ icon: "accelerometer", ariaId: "", x: 40, y: 0, onClick: () => basic.showNumber(0) }),
        new microcode.Button({ icon: "accelerometer", ariaId: "", x: 20, y: 0, onClick: () => basic.showNumber(6) })],
        [new microcode.Button({ icon: "accelerometer", ariaId: "", x: 40, y: 20, onClick: () => basic.showNumber(1) })]
    ],
    isActive: true,
})

const comp2 = new microcode.ButtonCollection({
    alignment: microcode.GUIComponentAlignment.LEFT,
    btns: [
        [new microcode.Button({ icon: "thermometer", ariaId: "", x: -40, y: 0, onClick: () => basic.showNumber(2) })],
        [new microcode.Button({ icon: "thermometer", ariaId: "", x: -40, y: 20, onClick: () => basic.showNumber(3) })]
    ],
    isActive: false,
    colour: 7,
})
    
const window = new microcode.Window({app, components: [comp1, comp2]})

app.pushScene(window)