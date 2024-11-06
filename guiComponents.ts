namespace microcode {
    /**
     * Passed to the constructor of a GUIComponent to quickly align it.
     * Alignment may be further adjusted by an xOffset & yOffset.
     * These alignments are used to calculate left & top values for a Bounds object.
     * This Bounds object is the extent of the component.
     * See getLeftAndTop in GUIComponentAbstract for how this is calculated.
     */
    export const enum GUIComponentAlignment {
        TOP,
        LEFT,
        RIGHT,
        BOT,
        CENTRE,
        TOP_RIGHT,
        TOP_LEFT,
        BOT_RIGHT,
        BOT_LEFT
    }

    /**
     * Greatly simplifies the creation & alignment of GUI components.
     * A GUI Component has a .context for storage of hidden component state.
     */
    abstract class GUIComponentAbstract extends Scene {
        private hidden: boolean;
        private context: any[];
        private alignment: GUIComponentAlignment

        protected bounds: Bounds;
        protected backgroundColour: number = 3;

        private scaling: number = 1.0;

        private xOffset: number;
        private yOffset: number;
        private unscaledComponentWidth: number;
        private unscaledComponentHeight: number;
        private hasBorder: boolean

        public nav: INavigator;

        constructor(opts: {
            alignment: GUIComponentAlignment,
            width: number,
            height: number,
            xOffset?: number,
            yOffset?: number,
            scaling?: number,
            colour?: number,
            border?: boolean
        }) {
            super()

            this.alignment = opts.alignment

            this.scaling = (opts.scaling) ? opts.scaling : this.scaling
            this.backgroundColour = (opts.colour) ? opts.colour : this.backgroundColour

            this.xOffset = (opts.xOffset != null) ? opts.xOffset : 0
            this.yOffset = (opts.yOffset != null) ? opts.yOffset : 0
            this.unscaledComponentWidth = opts.width
            this.unscaledComponentHeight = opts.height
            this.hasBorder = (opts.border != null) ? opts.border : false

            const pos = this.getLeftAndTop()
            const left = pos[0];
            const top = pos[1];

            this.bounds = new microcode.Bounds({
                width: this.unscaledComponentWidth * this.scaling,
                height: this.unscaledComponentHeight * this.scaling,
                left,
                top
            })
        }

        hide(): void { this.hidden = true }
        unHide(): void { this.hidden = false }

        getAlignment(): number { return this.alignment }
        isHidden(): boolean { return this.hidden }


        printCenter(text: string) {
            const textOffset = (font.charWidth * text.length) / 2
            screen().print(
                text,
                (screen().width / 2) + this.bounds.left + ((this.unscaledComponentWidth * this.scaling) / 2) - textOffset,
                (screen().height / 2) + this.bounds.top + 1
            )
        }

        /**
         * This should be overriden.
         * Other components should use this to get this components state.
         * @returns pertinent component state information, in appropriate format; at child components discretion.
         */
        getContext(): any[] {return this.context}

        clearContext(): void { this.context = [] }
        setBounds(bounds: Bounds): void { this.bounds = bounds }

        getLeftAndTop(): number[] {
            let left = 0
            let top = 0

            switch (this.alignment) {
                case (GUIComponentAlignment.TOP): {
                    left = -((this.unscaledComponentWidth * this.scaling) / 2) + this.xOffset;
                    top = -(screen().height / 2) + this.yOffset;
                    break;
                }
                case (GUIComponentAlignment.LEFT): {
                    left = -(screen().width / 2);
                    top = -((this.unscaledComponentHeight * this.scaling) / 2) + this.yOffset
                    break;
                }
                case (GUIComponentAlignment.RIGHT): {
                    left = (this.unscaledComponentWidth * this.scaling);
                    top = -((this.unscaledComponentHeight * this.scaling) / 2) + this.yOffset
                    break;
                }
                case (GUIComponentAlignment.BOT): {
                    left = -((this.unscaledComponentWidth * this.scaling) / 2) + this.xOffset;
                    top = (screen().height / 2) - (this.unscaledComponentHeight * this.scaling) - this.yOffset;
                    break;
                }
                case (GUIComponentAlignment.CENTRE): {
                    left = -((this.unscaledComponentWidth * this.scaling) / 2) + this.xOffset
                    top = -((this.unscaledComponentHeight * this.scaling) / 2) + this.yOffset
                    break;
                }
                case (GUIComponentAlignment.TOP_RIGHT): { }
                case (GUIComponentAlignment.TOP_LEFT): { }
                case (GUIComponentAlignment.BOT_RIGHT): { }
                case (GUIComponentAlignment.BOT_LEFT): { }
            }

            return [left, top]
        }

        rescale(newScale: number): void {
            if (this.bounds != null) {
                this.scaling = newScale
                this.bounds = new microcode.Bounds({
                    width: this.unscaledComponentWidth * this.scaling,
                    height: this.unscaledComponentHeight * this.scaling,
                    left: this.bounds.left,
                    top: this.bounds.top
                })
            }
        }

        draw(): void {
            screen().fillRect(
                this.bounds.left + (screen().width / 2),
                this.bounds.top + (screen().height / 2) + 2,
                this.bounds.width + 2,
                this.bounds.height,
                15
            )

            this.bounds.fillRect(this.backgroundColour)
        }
    }


    export class B extends GUIComponentAbstract {
        public cursor: Cursor
        public picker: Picker
        public navigator: INavigator
        private btns: Button[];
        private title: string;

        constructor(opts: {
            alignment: GUIComponentAlignment,
            width: number,
            height: number,
            xOffset?: number,
            yOffset?: number,
            scaling?: number,
            colour?: number,
            title?: string,
        }) {
            super(opts)

            this.btns = [];
            this.title = (opts.title != null) ? opts.title : ""
            this.navigator = new microcode.GridNavigator(3, 4)

            this.startup()
        }

        /* override */ startup() {
            super.startup()

            let x = (screen().width / 5) - (screen().width / 2);
            let y = -30;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 4; j++) {
                    this.btns.push(new Button({
                        parent: null,
                        style: ButtonStyles.Transparent,
                        icon: "" + ((i * 4) + j + 1),
                        x,
                        y,
                        onClick: (button: Button) => { }
                    }))
                    x += screen().width / 5
                }
                y += screen().height / 4
                x = (screen().width / 5) - (screen().width / 2);
            }

            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.right.id,
                () => this.moveCursor(CursorDir.Right)
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.up.id,
                () => this.moveCursor(CursorDir.Up)
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.down.id,
                () => this.moveCursor(CursorDir.Down)
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.left.id,
                () => this.moveCursor(CursorDir.Left)
            )

            // click
            const click = () => this.cursor.click()
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.A.id,
                click
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.A.id + keymap.PLAYER_OFFSET,
                click
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.B.id,
                () => this.back()
            )

            this.cursor.navigator = this.navigator
            this.navigator.addButtons(this.btns)

            this.cursor = new Cursor()
            this.picker = new Picker(this.cursor)

            if (this.navigator == null)
                this.navigator = new RowNavigator()
            this.cursor.navigator = this.navigator
        }

        draw() {
            Screen.fillRect(
                Screen.LEFT_EDGE,
                Screen.TOP_EDGE,
                Screen.WIDTH,
                Screen.HEIGHT,
                0xc
            )

            this.printCenter(this.title)

            // if (this.picker == null || this.cursor == null) {
            //     basic.showString("Y")
            // }

            // this.picker.draw()
            // this.cursor.draw()

            // for (let i = 0; i < this.btns.length; i++)
            //     this.btns[i].draw()

            super.draw()
        }

        protected moveCursor(dir: CursorDir) {
            try {
                this.moveTo(this.cursor.move(dir))
            } catch (e) {
                if (dir === CursorDir.Up && e.kind === BACK_BUTTON_ERROR_KIND)
                    this.back()
                else if (
                    dir === CursorDir.Down &&
                    e.kind === FORWARD_BUTTON_ERROR_KIND
                )
                    return
                else throw e
            }
        }

        protected moveTo(target: Button) {
            if (!target) return
            this.cursor.moveTo(
                target.xfrm.worldPos,
                target.ariaId,
                target.bounds
            )
        }

        back() {
            if (!this.cursor.cancel()) this.moveCursor(CursorDir.Back)
        }

        protected handleClick(x: number, y: number) {
            const target = this.cursor.navigator.screenToButton(
                x - Screen.HALF_WIDTH,
                y - Screen.HALF_HEIGHT
            )
            if (target) {
                this.moveTo(target)
                target.click()
            } else if (this.picker.visible) {
                this.picker.hide()
            }
        }

        protected handleMove(x: number, y: number) {
            const btn = this.cursor.navigator.screenToButton(
                x - Screen.HALF_WIDTH,
                y - Screen.HALF_HEIGHT
            )
            if (btn) {
                const w = btn.xfrm.worldPos
                this.cursor.snapTo(w.x, w.y, btn.ariaId, btn.bounds)
                btn.reportAria(true)
            }
        }

        /* override */ shutdown() {
            this.navigator.clear()
        }

        /* override */ activate() {
            super.activate()
            const btn = this.navigator.initialCursor(0, 0)
            if (btn) {
                const w = btn.xfrm.worldPos
                this.cursor.snapTo(w.x, w.y, btn.ariaId, btn.bounds)
                btn.reportAria(true)
            }
        }

        /* override */ update() {
            this.cursor.update()
        }
    }

    export class GUITestComponent extends GUIComponentAbstract {
        static DEFAULT_WIDTH: number = screen().width / 2;
        static DEFAULT_HEIGHT: number = screen().height / 2;

        private btns: Button[]
        private title: string

        constructor(opts: {
            alignment: GUIComponentAlignment,
            xOffset?: number,
            yOffset?: number,
            scaling?: number,
            colour?: number,
            border?: boolean,
            title?: string
        }) {
            super({
                alignment: opts.alignment,
                xOffset: (opts.xOffset != null) ? opts.xOffset : 0,
                yOffset: (opts.yOffset != null) ? opts.yOffset : 0,
                width: GUITestComponent.DEFAULT_WIDTH,
                height: GUITestComponent.DEFAULT_HEIGHT,
                scaling: opts.scaling,
                colour: opts.colour,
                border: opts.border
            })

            this.btns = [
                new microcode.Button({
                    icon: "",
                    x: -(10 * ((opts.xOffset != null) ? opts.xOffset : 1)),
                    y: -30
                })
            ]

            this.title = (opts.title != null) ? opts.title : ""

            this.nav = new microcode.GridNavigator(3, 4)
            this.nav.addButtons(this.btns)
        }

        draw() {
            super.draw()
            this.printCenter(this.title)
            // this.bounds.fillRect(this.backgroundColour)

            // this.btns.forEach(btn => btn.draw())
        }
    }

    export class GUISceneAbstract extends GUIComponentAbstract {
        navigator: INavigator
        public cursor: Cursor
        public picker: Picker

        constructor(opts: {
            alignment: GUIComponentAlignment,
            xOffset?: number,
            yOffset?: number,
            width: number,
            height: number,
            scaling?: number,
            colour?: number,
            navigator?: INavigator
        }) {
            super({
                alignment: opts.alignment,
                xOffset: (opts.xOffset != null) ? opts.xOffset : 0,
                yOffset: (opts.yOffset != null) ? opts.yOffset : 0,
                width: GUITestComponent.DEFAULT_WIDTH,
                height: GUITestComponent.DEFAULT_HEIGHT,
                scaling: opts.scaling,
                colour: opts.colour
            })

            this.navigator = opts.navigator

            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.right.id,
                () => this.moveCursor(CursorDir.Right)
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.up.id,
                () => this.moveCursor(CursorDir.Up)
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.down.id,
                () => this.moveCursor(CursorDir.Down)
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.left.id,
                () => this.moveCursor(CursorDir.Left)
            )

            // click
            const click = () => this.cursor.click()
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.A.id,
                click
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.A.id + keymap.PLAYER_OFFSET,
                click
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.B.id,
                () => this.back()
            )

            // this.cursor = new Cursor()
            // this.picker = new Picker(this.cursor)
            // this.navigator = new RowNavigator()
            // this.cursor.navigator = this.navigator
        }

        protected moveCursor(dir: CursorDir) {
            try {
                this.moveTo(this.cursor.move(dir))
            } catch (e) {
                if (dir === CursorDir.Up && e.kind === BACK_BUTTON_ERROR_KIND)
                    this.back()
                else if (
                    dir === CursorDir.Down &&
                    e.kind === FORWARD_BUTTON_ERROR_KIND
                )
                    return
                else throw e 
            }
        }

        protected moveTo(target: Button) {
            if (!target) return
            this.cursor.moveTo(
                target.xfrm.worldPos,
                target.ariaId,
                target.bounds
            )
        }

        back() {
            if (!this.cursor.cancel()) this.moveCursor(CursorDir.Back)
        }

        protected handleClick(x: number, y: number) {
            const target = this.cursor.navigator.screenToButton(
                x - Screen.HALF_WIDTH,
                y - Screen.HALF_HEIGHT
            )
            if (target) {
                this.moveTo(target)
                target.click()
            } else if (this.picker.visible) {
                this.picker.hide()
            }
        }

        protected handleMove(x: number, y: number) {
            const btn = this.cursor.navigator.screenToButton(
                x - Screen.HALF_WIDTH,
                y - Screen.HALF_HEIGHT
            )
            if (btn) {
                const w = btn.xfrm.worldPos
                this.cursor.snapTo(w.x, w.y, btn.ariaId, btn.bounds)
                btn.reportAria(true)
            }
        }

        /* override */ shutdown() {
            this.navigator.clear()
        }

        /* override */ activate() {
            // super.activate()
            const btn = this.navigator.initialCursor(0, 0)
            if (btn) {
                const w = btn.xfrm.worldPos
                this.cursor.snapTo(w.x, w.y, btn.ariaId, btn.bounds)
                btn.reportAria(true)
            }
        }

        /* override */ update() {
            this.cursor.update()
        }

        /* override */ draw() {
            this.picker.draw()
            this.cursor.draw()
        }
    }


    const KEYBOARD_FRAME_COUNTER_CURSOR_ON = 20;
    const KEYBOARD_FRAME_COUNTER_CURSOR_OFF = 40;
    const KEYBOARD_MAX_TEXT_LENGTH = 20;

    export class KeyboardComponent extends GUISceneAbstract {
        private static DEFAULT_WIDTH: number = screen().width
        private static DEFAULT_HEIGHT: number = 80
        private static WIDTHS: number[] = [10, 10, 10, 10, 4]
        private btns: Button[]
        private btnText: string[]

        private text: string;
        private upperCase: boolean;
        private next: (arg0: string) => void;
        private frameCounter: number;
        private shakeText: boolean
        private shakeTextCounter: number

        constructor(opts: {
            next: (arg0: string) => void,
            alignment: GUIComponentAlignment,
            xOffset?: number,
            yOffset?: number,
            scaling?: number,
            colour?: number,
        }) {
        // constructor(app: App, next: (arg0: string) => void) {
            // super(app, new GridNavigator(5, 5, KeyboardComponent.WIDTHS))

            super({
                alignment: opts.alignment,
                xOffset: (opts.xOffset != null) ? opts.xOffset : 0,
                yOffset: (opts.yOffset != null) ? opts.yOffset : 0,
                width: KeyboardComponent.DEFAULT_WIDTH,
                height: KeyboardComponent.DEFAULT_HEIGHT,
                scaling: opts.scaling,
                colour: opts.colour
            })

            this.text = ""
            this.upperCase = true

            this.btns = []
            this.btnText = [
                "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
                "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
                "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
                "U", "V", "W", "X", "Y", "Z", ",", ".", "?", "!",
                "<-", "^", " _______ ", "ENTER"
            ];

            this.next = opts.next
            this.frameCounter = 0;
            this.shakeText = false;
            this.shakeTextCounter = 0;

            const defaultBehaviour = (btn: Button) => {
                if (this.text.length < KEYBOARD_MAX_TEXT_LENGTH) {
                    this.text += this.btnText[btn.state[0]]
                    this.frameCounter = KEYBOARD_FRAME_COUNTER_CURSOR_ON
                }
                else {
                    this.shakeText = true
                }
            }

            for (let i = 0; i < 4; i++) {
                const xDiff = screen().width / (KeyboardComponent.WIDTHS[i] + 1);
                for (let j = 0; j < 10; j++) {
                    this.btns.push(
                        new Button({
                            parent: null,
                            style: ButtonStyles.Transparent,
                            icon: bitmaps.create(10, 10),
                            ariaId: "",
                            x: (xDiff * (j + 1)) - (screen().width / 2),
                            y: (13 * (i + 1)) - 18,
                            onClick: defaultBehaviour,
                            state: [(i * 10) + j]
                        })
                    )
                }
            }

            const botRowBehaviours = [
                () => {
                    this.text =
                        (this.text.length > 0)
                            ? this.text.substr(0, this.text.length - 1)
                            : this.text
                    this.frameCounter = KEYBOARD_FRAME_COUNTER_CURSOR_ON
                },
                () => { this.changeCase() },
                () => {
                    if (this.text.length < KEYBOARD_MAX_TEXT_LENGTH) {
                        this.text += " ";
                        this.frameCounter = KEYBOARD_FRAME_COUNTER_CURSOR_ON;
                    }
                    else {
                        this.shakeText = true
                    }
                },
                () => { this.next(this.text) }
            ]

            const icons = [bitmaps.create(16, 10), bitmaps.create(10, 10), bitmaps.create(55, 10), bitmaps.create(33, 10)]
            const x = [22, 38, 74, 124]
            for (let i = 0; i < 4; i++) {
                this.btns.push(
                    new Button({
                        parent: null,
                        style: ButtonStyles.Transparent,
                        icon: icons[i],
                        ariaId: "",
                        x: x[i] - (screen().width / 2),
                        y: (13 * 5) - 18,
                        onClick: botRowBehaviours[i]
                    })
                )
            }

            this.changeCase()
            this.navigator.addButtons(this.btns)
        }

        private changeCase() {
            this.upperCase = !this.upperCase;

            if (this.upperCase)
                this.btnText = this.btnText.map((btn, i) =>
                    btn = (i < 40) ? btn.toUpperCase() : btn
                )
            else
                this.btnText = this.btnText.map((btn, i) =>
                    btn = (i < 40) ? btn.toLowerCase() : btn
                )
        }

        draw() {
            this.frameCounter += 1

            // Blue base colour:
            Screen.fillRect(
                Screen.LEFT_EDGE,
                Screen.TOP_EDGE,
                Screen.WIDTH,
                Screen.HEIGHT,
                6 // Blue
            )

            // Orange Keyboard with a black shadow on the bot & right edge (depth effect):

            // Black border around right & bot edge:
            Screen.fillRect(
                Screen.LEFT_EDGE + 4,
                Screen.TOP_EDGE + 47,
                Screen.WIDTH - 6,
                71,
                15 // Black
            )

            // Orange keyboard that the white text will be ontop of:
            Screen.fillRect(
                Screen.LEFT_EDGE + 4,
                Screen.TOP_EDGE + 44,
                Screen.WIDTH - 8,
                72,
                4 // Orange
            )

            for (let i = 0; i < this.btns.length; i++) {
                this.btns[i].draw()

                const x = (screen().width / 2) + this.btns[i].xfrm.localPos.x - (this.btns[i].icon.width / 2) + 2
                const y = (screen().height / 2) + this.btns[i].xfrm.localPos.y + font.charHeight - 12
                screen().print(this.btnText[i], x, y, 1) // White text
            }

            super.draw()
        }
    }



    /**
     * Holds other components,
     * One component is active at a time
     */
    export class Window extends Scene {
        private components: GUIComponentAbstract[];
        private currentComponentID: number;

        constructor(opts: {
            app: App,
            colour?: number,
            next?: (arg0: any[]) => void,
            back?: (arg0: any[]) => void,
            components?: GUIComponentAbstract[],
            hideByDefault?: boolean
        }) {
            super(app)

            if (opts.colour != null)
                this.backgroundColor = opts.colour

            this.components = opts.components
            this.currentComponentID = 0

            if (this.components != null && opts.hideByDefault)
                this.focus(this.currentComponentID)
        }

        /* override */ startup() {
            super.startup()
        }

        focus(componentID: number, hideOthers: boolean = true) {
            if (hideOthers)
                this.components.forEach(component => component.hide())
            this.components[componentID].unHide()

            this.currentComponentID = componentID
        }

        showAllComponents() {
            this.components.forEach(component => component.unHide())
        }


        draw() {
            super.draw()

            screen().fillRect(
                0,
                0,
                screen().width,
                screen().height,
                this.backgroundColor
            )

            this.components.forEach(component => {
                if (!component.isHidden())
                    component.draw()
            })

            // this.cursor.draw()
        }
    }
}