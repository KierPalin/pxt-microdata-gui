input.onButtonPressed(Button.B, function () {
    y = Math.min(y + 10, 100)
})
let y = 0
const app = new microcode.App();
const calc = (arg0: microcode.GraphableFunction) => {
    app.popScene()
    app.pushScene(new microcode.LiveDataViewer(app, [arg0]))
}

const gf = new microcode.GraphableFunction((x) => y)

const w = new microcode.Window({
    app,
    components: [
        new microcode.GUIBox({
            alignment: microcode.GUIComponentAlignment.TOP,
            xOffset: 0,
            yOffset: 0,
            xScaling: 0.5,
            yScaling: 0.3,
            title: "Hello"
        }),
        // new microcode.GUIBox({
        //     alignment: microcode.GUIComponentAlignment.LEFT,
        //     xScaling: 0.8,
        //     yScaling: 0.8,
        //     colour: 4
        // }),
        new microcode.GUISlider({
            alignment: microcode.GUIComponentAlignment.LEFT,
            xScaling: 0.8,
            yScaling: 0.8,
            colour: 4
        }),
        new microcode.GUIGraph({
            alignment: microcode.GUIComponentAlignment.RIGHT,
            graphableFns: [gf],
            xOffset: -5,
            yOffset: 0,
            xScaling: 1,
            yScaling: 1,
            colour: 6
        }),
        // new microcode.GUIBox({
        //     alignment: microcode.GUIComponentAlignment.BOT,
        //     xOffset: 0,
        //     yOffset: 0,
        //     xScaling: 0.6,
        //     yScaling: 0.3,
        //     colour: 7
        // })
    ]
});
app.pushScene(w)
