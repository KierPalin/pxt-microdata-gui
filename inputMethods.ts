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
        }
        
        upBtnPressed() {
            this.tickerValues[this.currentTickerIndex] += 1;
        }

        downBtnPressed() {
            this.tickerValues[this.currentTickerIndex] -= 1;
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
                screen().print(
                    "" + this.tickerValues[i],
                    ((i + 1) * xDiff) - 3,
                    screen().height / 2,
                    0
                )
            }
        }
    }

    export class KeyboardMenu extends AbstractInputMethod {

    }

    export class CallbackMenu extends AbstractInputMethod {

    }
}