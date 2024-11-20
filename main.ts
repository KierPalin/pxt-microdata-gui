namespace microcode {
    const app = new App();

    const simpleBtnComponent = new ButtonCollection({
        alignment: GUIComponentAlignment.TOP,
        btns: [[new Button({ icon: "accelerometer", onClick: () => basic.showNumber(0) })]],
        isActive: true,
    })

    const comp1 = new ButtonCollection({
        alignment: GUIComponentAlignment.TOP,
        btns: [
            [new Button({ icon: "accelerometer", ariaId: "", x: 0, y: 0, onClick: () => basic.showNumber(0) }),
            new Button({ icon: "accelerometer", ariaId: "", x: 20, y: 0, onClick: () => basic.showNumber(6) })],
            [new Button({ icon: "accelerometer", ariaId: "", x: 20, y: 20, onClick: () => basic.showNumber(1) })]
        ],
        isActive: true,
    })
    
    const comp2BtnBehaviour = () => {Window.makeComponentActive(0)}

    const comp2 = new ButtonCollection({
        alignment: GUIComponentAlignment.LEFT,
        btns: [
            [new Button({ icon: "thermometer", ariaId: "", x: 10, y: 0, onClick: comp2BtnBehaviour})],
            [new Button({ icon: "thermometer", ariaId: "", x: 10, y: 20, onClick: comp2BtnBehaviour})]
        ],
        isActive: false,
        isHidden: true,
        colour: 7,
    })

    const comp3 = new ButtonCollection({
        alignment: GUIComponentAlignment.BOT_RIGHT,
        btns: [
            [new Button({ icon: "thermometer", onClick: () => basic.showString("hi") })],
        ],
        isActive: false,
        isHidden: true,
        colour: 2,
        xScaling: 0.7,
        xOffset: -10
    })

    const window = new Window({ app, components: [comp1, comp2, comp3] })
    // const window = new Window({ app, components: [simpleBtnComponent] })

    app.pushScene(window)
}