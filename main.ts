const app = new microcode.App();

// const calc = (arg0: microcode.GraphableFunction) => {
//     app.popScene()
//     app.pushScene(new microcode.LiveDataViewer(app, [arg0]))
// }
// const mMenu = new microcode.CalculatorMenu(app, calc);
// app.pushScene(mMenu)


const s = new microcode.Window({
    app, 
    components: [
        new microcode.GUITestComponent({
            alignment: microcode.GUIComponentAlignment.TOP, 
            bounds: new microcode.Bounds({width: screen().width / 2, height: screen().height / 2, left: -(screen().width / 2), top: -(screen().height / 2)})
        })
    ]
})

app.pushScene(s)