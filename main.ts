const app = new microcode.App();
const calc = (arg0: microcode.GraphableFunction) => {
    app.popScene()
    app.pushScene(new microcode.LiveDataViewer(app, [arg0]))
}
const w = new microcode.Window({
    app,
    components: [
        new microcode.GUIBox({
            alignment: microcode.GUIComponentAlignment.TOP_RIGHT,
            xOffset: 0,
            yOffset: 4,
            xScaling: 0.4,
            yScaling: 0.3,
            title: "Howdy"
        }),
        new microcode.GUIBox({
            alignment: microcode.GUIComponentAlignment.TOP_LEFT,
            xOffset: 1,
            yOffset: 0,
            xScaling: 0.5,
            yScaling: 0.5,
            colour: 4,
            title: "hiya"
        }),
        new microcode.GUIBox({
            alignment: microcode.GUIComponentAlignment.CENTRE,
            xOffset: 3,
            yOffset: 0,
            xScaling: 0.7,
            yScaling: 0.9,
            colour: 5
        }),
        new microcode.GUIBox({
            alignment: microcode.GUIComponentAlignment.BOT_LEFT,
            xOffset: 0,
            yOffset: 0,
            xScaling: 0.4,
            yScaling: 0.4,
            colour: 6
        }),
        new microcode.GUIBox({
            alignment: microcode.GUIComponentAlignment.BOT,
            xOffset: 0,
            yOffset: 0,
            xScaling: 0.3,
            yScaling: 0.3,
            colour: 7
        })
    ]
});
// app.pushScene(w)


const kb = new microcode.KeyboardMenu(app, (x) => basic.showString(x))

app.pushScene(kb)