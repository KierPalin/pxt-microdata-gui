const app = new microcode.App();
const calc = (arg0: microcode.GraphableFunction) => {
    app.popScene()
    app.pushScene(new microcode.LiveDataViewer(app, [arg0]))
}


let y = 0;
input.onButtonPressed(Button.A, function() {
    y += 10
})

// const ldv = new microcode.LiveDataViewer(app, [
const gf = new microcode.GraphableFunction((x) => Math.min(y, 90))
// ])


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
        new microcode.GUIGraph({
            alignment: microcode.GUIComponentAlignment.CENTRE,
            graphableFns: [gf],
            xOffset: 3,
            yOffset: 0,
            xScaling: 1,
            yScaling: 1
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
app.pushScene(w)


// const kb = new microcode.KeyboardMenu(app, (x) => basic.showString(x))
// app.pushScene(kb)


// let y = 0;
// input.onButtonPressed(Button.A, function() {
//     y += 10
// })

// const ldv = new microcode.LiveDataViewer(app, [
//     new microcode.GraphableFunction((x) => Math.min(y, 90))
// ])
// app.pushScene(ldv)