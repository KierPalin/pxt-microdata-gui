const app = new microcode.App();
const calc = (arg0: microcode.GraphableFunction) => {
    app.popScene()
    app.pushScene(new microcode.LiveDataViewer(app, [arg0]))
}
const mMenu = new microcode.CalculatorMenu(app, calc);
app.pushScene(mMenu)
