const app = new microcode.App();
const calc = (arg0: microcode.GraphableFunction) => {
    app.popScene()
    app.pushScene(new microcode.LiveDataViewer(app, [arg0]))
}
// const mMenu = new microcode.CalculatorMenu(app, calc);
// app.pushScene(mMenu)

const s = new microcode.Window({
    app,
    components: [
        new microcode.GUITestComponent({
            alignment: microcode.GUIComponentAlignment.TOP,
            xOffset: 0,
            yOffset: 0,
        }),
        new microcode.GUITestComponent({
            alignment: microcode.GUIComponentAlignment.TOP,
            xOffset: -(screen().width / 2),
            yOffset: 0,
            colour: 4
        })
    ]
});


app.pushScene(s)