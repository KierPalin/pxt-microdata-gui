namespace microcode {
    abstract class AbstractInputMethod extends Scene {
        protected titleText: string;

        upBtnPressed() {}
        downBtnPressed() {}
        leftBtnPressed() {}
        rightBtnPressed() {}
        aBtnPressed() {}
        bBtnPressed() { }
        
        draw() {
            screen().fillRect(0, 0, screen().width, screen().height, this.backgroundColor)

            screen().printCenter(this.titleText, 4)
        }
    }

    export class TickerMenu extends AbstractInputMethod {
        private tickerValues: number[];
        private tickerIncrements: number[];
        private currentTickerIndex: number;

        private next: (arg0: number[]) => void;
        private back: () => void;

        constructor(
            app: App,
            titleText: string,
            defaultTickerValues: number[],
            backgroundColor?: number,
            next?: (arg0: number[]) => void,
            back?: () => void,
        ) {
            super(app, "TickerMenu")
            
            this.backgroundColor = (backgroundColor != null) ? backgroundColor : 3;
 
            this.titleText = titleText;

            this.tickerValues = defaultTickerValues;
            this.tickerIncrements = this.tickerValues.map(_ => 1)
            this.currentTickerIndex = 0;

            this.next = next;
            this.back = back;

            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.left.id,
                () => this.leftBtnPressed()
            )

            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.right.id,
                () => this.rightBtnPressed()
            )

            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.up.id,
                () => this.upBtnPressed()
            )

            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.down.id,
                () => this.downBtnPressed()
            )

            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.A.id,
                () => this.aBtnPressed()
            )

            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.B.id,
                () => this.bBtnPressed()
            )
        }
        
        upBtnPressed() {
            let tick = true;
            control.onEvent(
                ControllerButtonEvent.Released,
                controller.up.id,
                () => tick = false
            )
            while (tick) {
                this.tickerValues[this.currentTickerIndex] += 1
                basic.pause(100)
            }
            control.onEvent(ControllerButtonEvent.Released, controller.up.id, () => {})
        }

        downBtnPressed() {
            let tick = true;
            control.onEvent(
                ControllerButtonEvent.Released,
                controller.down.id,
                () => tick = false
            )
            while (tick) {
                this.tickerValues[this.currentTickerIndex] -= 1
                basic.pause(100)
            }
            control.onEvent(ControllerButtonEvent.Released, controller.down.id, () => {})
        }

        leftBtnPressed() {
            this.currentTickerIndex = (((this.currentTickerIndex - 1) % this.tickerIncrements.length) + this.tickerIncrements.length) % this.tickerIncrements.length
        }

        rightBtnPressed() {
            this.currentTickerIndex = (this.currentTickerIndex + 1) % this.tickerIncrements.length;
        }

        aBtnPressed() {
            if (this.next != null)
                this.next(this.tickerValues)
        }

        bBtnPressed() {
            if (this.back != null)
                this.back()
        }

        draw() {
            super.draw()

            const xDiff = screen().width / (this.tickerValues.length + 1)

            for (let i = 0; i < this.tickerValues.length; i++) {
                const value: string = "" + this.tickerValues[i];
                screen().print(
                    value,
                    ((i + 1) * xDiff) - 3,
                    screen().height / 2,
                    0
                )

                screen().fillTriangle(
                    ((i + 1) * xDiff) - 4,
                    (screen().height / 2) - 2,
                    ((i + 1) * xDiff) - 4 + (font.charWidth * value.length + 1) + 1,
                    (screen().height / 2) - 2,
                    ((i + 1) * xDiff) - 4 + ((font.charWidth * value.length + 1) / 2) + 1,
                    (screen().height / 2) - 7,
                    5
                )

                screen().fillTriangle(
                    ((i + 1) * xDiff) - 4,
                    (screen().height / 2) + 9,
                    ((i + 1) * xDiff) - 4 + (font.charWidth * value.length + 1) + 1,
                    (screen().height / 2) + 9,
                    ((i + 1) * xDiff) - 4 + ((font.charWidth * value.length + 1) / 2) + 1,
                    (screen().height / 2) + 14,
                    5
                )
            }
        }
    }

    export class KeyboardMenu extends AbstractInputMethod {

    }

    export class CallbackMenu extends AbstractInputMethod {

    }
}