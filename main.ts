const app = new microcode.App();
const calc = (arg0: microcode.GraphableFunction) => {
    app.popScene()
    app.pushScene(new microcode.LiveDataViewer(app, [arg0]))
}
const w = new microcode.Window({
    app,
    components: [
        new microcode.GUITestComponent({
            alignment: microcode.GUIComponentAlignment.TOP,
            xOffset: 0,
            yOffset: 4,
            scaling: 0.5,
            title: "Howdy"
        }),
        new microcode.GUITestComponent({
            alignment: microcode.GUIComponentAlignment.LEFT,
            xOffset: 3,
            yOffset: 0,
            scaling: 0.7,
            colour: 4,
            title: "woweee"
        }),
        new microcode.GUITestComponent({
            alignment: microcode.GUIComponentAlignment.RIGHT,
            xOffset: 3,
            yOffset: 0,
            scaling: 0.7,
            colour: 5
        }),
        new microcode.GUITestComponent({
            alignment: microcode.GUIComponentAlignment.CENTRE,
            xOffset: 0,
            yOffset: 0,
            scaling: 0.4,
            colour: 6
        }),
        new microcode.GUITestComponent({
            alignment: microcode.GUIComponentAlignment.BOT,
            xOffset: 0,
            yOffset: 0,
            scaling: 0.4,
            colour: 7
        })
    ]
});
app.pushScene(w)
