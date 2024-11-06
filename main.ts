const app = new microcode.App();
const calc = (arg0: microcode.GraphableFunction) => {
    app.popScene()
    app.pushScene(new microcode.LiveDataViewer(app, [arg0]))
}

let y = 0;
input.onButtonPressed(Button.A, function () {
    y = Math.min(y + 10, 100)
})
const gf = new microcode.GraphableFunction((x) => y)

const w = new microcode.Window({
    app,
    components: [
        new microcode.GUIBox({
            alignment: microcode.GUIComponentAlignment.TOP,
            xOffset: 0,
            yOffset: 4,
            xScaling: 0.3,
            yScaling: 0.3,
            title: "Howdy"
        }),
        new microcode.GUIBox({
            alignment: microcode.GUIComponentAlignment.LEFT,
            xOffset: 3,
            yOffset: 0,
            xScaling: 0.8,
            yScaling: 0.8,
            colour: 4
        }),
        new microcode.GUIBox({
            alignment: microcode.GUIComponentAlignment.RIGHT,
            xOffset: 3,
            yOffset: 0,
            xScaling: 0.5,
            yScaling: 0.5,
            colour: 5
        }),
        new microcode.GUIGraph({
            alignment: microcode.GUIComponentAlignment.TOP_LEFT,
            graphableFns: [gf],
            xOffset: -10,
            yOffset: 10,
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
