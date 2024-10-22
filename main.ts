const app = new microcode.App();
const calc = (arg0: microcode.GraphableFunction) => {
    app.popScene()
    app.pushScene(new microcode.LiveDataViewer(app, [arg0]))
}
const mMenu = new microcode.KeyboardMenu(app, (s: string) => {basic.showString(s)});
app.pushScene(mMenu)
