namespace microcode {
    const app = new App();

    const simpleTextComponent = new TextBox({
        alignment: GUIComponentAlignment.TOP,
        isActive: false,
        title: "Title Text :)",
        text: ["Hello there,", "I hope you are well.", "Isn't this neat?"],
        colour: 6,
        xScaling: 1.7,
    })

    const window = new Window({ app, components: [simpleTextComponent] })
    app.pushScene(window)
    










    // const simpleBtnComponent = new ButtonCollection({
    //     alignment: GUIComponentAlignment.TOP,
    //     btns: [[new Button({ icon: "accelerometer", onClick: () => basic.showNumber(0) })]],
    //     isActive: true,
    // })

    // const comp1 = new ButtonCollection({
    //     alignment: GUIComponentAlignment.TOP,
    //     btns: [
    //         [new Button({ icon: "pin_0", ariaId: "", x: 0, y: 0, onClick: () => basic.showNumber(0) }),
    //         new Button({ icon: "pin_1", ariaId: "1", x: 20, y: 0, onClick: () => basic.showNumber(1) })],
    //         [new Button({ icon: "green_tick", ariaId: "Done", x: 20, y: 20, onClick: () => Window.makeComponentActive(2, false) })]
    //     ],
    //     isActive: true,
    // })

    // const comp2 = new ButtonCollection({
    //     alignment: GUIComponentAlignment.LEFT,
    //     btns: [
    //         [new Button({ icon: "thermometer", ariaId: "", x: 10, y: 0, onClick: () => basic.showNumber(0) })],
    //         [new Button({ icon: "green_tick", ariaId: "", x: 10, y: 20, onClick: () => Window.makeComponentActive(0, true) })]
    //     ],
    //     isActive: false,
    //     isHidden: true,
    //     colour: 7,
    // })

    // const comp3 = new ButtonCollection({
    //     alignment: GUIComponentAlignment.BOT_RIGHT,
    //     btns: [
    //         [new Button({ icon: "thermometer", onClick: () => basic.showString("hi") })],
    //     ],
    //     isActive: false,
    //     isHidden: true,
    //     colour: 2,
    //     xScaling: 0.7,
    //     xOffset: -10
    // })

    // const comp4 = new GUIGraph({
    //     alignment: GUIComponentAlignment.BOT_LEFT,
    //     graphableFns: [new GraphableFunction((x) => (5 * Math.sin(x)) + 20)],
    //     isActive: false,
    //     isHidden: true,
    // })

    // const window = new Window({ app, components: [comp1, simpleTextComponent, comp2, comp3, comp4] })
    // const window = new Window({ app, components: [simpleBtnComponent] })

    // app.pushScene(window)
}