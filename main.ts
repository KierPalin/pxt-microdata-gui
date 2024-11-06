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
            scaling: 0.9
        }),
        new microcode.GUITestComponent({
            alignment: microcode.GUIComponentAlignment.LEFT,
            xOffset: 3,
            yOffset: 0,
            scaling: 0.8,
            colour: 4
        }),
        new microcode.GUITestComponent({
            alignment: microcode.GUIComponentAlignment.RIGHT,
            xOffset: 3,
            yOffset: 0,
            scaling: 0.5,
            colour: 5
        }),
        new microcode.GUITestComponent({
            alignment: microcode.GUIComponentAlignment.CENTRE,
            xOffset: 0,
            yOffset: 0,
            scaling: 0.6,
            colour: 6
        }),
        new microcode.GUITestComponent({
            alignment: microcode.GUIComponentAlignment.BOT,
            xOffset: 0,
            yOffset: 0,
            scaling: 0.6,
            colour: 7
        })
    ],
    colour: 9
});
// app.pushScene(w)

app.pushScene(
    new microcode.B({
        alignment: microcode.GUIComponentAlignment.BOT,
        xOffset: 0,
        yOffset: 0,
        width: 50,
        height: 50,
        scaling: 0.6,
        colour: 7
    })
)