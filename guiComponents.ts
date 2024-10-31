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
    abstract class GUIComponentAbstract {
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

        constructor(opts: {
            alignment: GUIComponentAlignment,
            xOffset: number,
            yOffset: number,
            width: number,
            height: number,
            scaling?: number,
            colour?: number
        }) {
            this.alignment = opts.alignment

            this.scaling = (opts.scaling) ? opts.scaling : this.scaling
            this.backgroundColour = (opts.colour) ? opts.colour : this.backgroundColour

            this.xOffset = opts.xOffset
            this.yOffset = opts.yOffset
            this.unscaledComponentWidth = opts.width
            this.unscaledComponentHeight = opts.height

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

        }
    }

    export class GUITestComponent extends GUIComponentAbstract {
        static DEFAULT_WIDTH: number = screen().width / 2;
        static DEFAULT_HEIGHT: number = screen().height / 2;

        constructor(opts: {
            alignment: GUIComponentAlignment,
            xOffset: number,
            yOffset: number,
            scaling?: number,
            colour?: number
        }) {
            super({
                alignment: opts.alignment,
                xOffset: opts.xOffset,
                yOffset: opts.yOffset,
                width: GUITestComponent.DEFAULT_WIDTH,
                height: GUITestComponent.DEFAULT_HEIGHT,
                scaling: opts.scaling,
                colour: opts.colour
            })
        }

        draw() {
            this.bounds.fillRect(this.backgroundColour)
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
            components?: GUIComponentAbstract[]
        }) {
            super(app, "window")

            // if (colour != null)
            //     this.backgroundColor = colour

            this.components = opts.components
            this.currentComponentID = 0

            // if (this.components != null)
            //     this.focus(this.currentComponentID)

            // const boundaries = this.getComponentBounds();
            // this.components.forEach((component, i) => component.setBounds(boundaries[i]));
        }

        /**
         * Calculate the bounds for each of the components.
         * Based upon the sizes, alighment & offset of each
         */
        getComponentBounds(): Bounds[] {
            const boundaries = [new Bounds({ width: 0, height: 0, left: 0, top: 0 })]

            if (this.components.length == 1) {
                return [new Bounds({ width: 0, height: 0, left: 0, top: 0 })]
            }

            // Attempt to vertically split components that share the same Vert GUIComponentAlignment
            // Components with same alignment are drawn overlappling
            // TOP_LEFT, TOP_RIGHT, BOT_LEFT, BOT_RIGHT take implicit precedence over LEFT & RIGHT

            // Components are still drawn top-left to bot-right regardless of bounds

            // Find top aligned-components:
            let topAlignedComponentIndices: number[] = []
            this.components.forEach((component, i) => {
                if (component.getAlignment() == GUIComponentAlignment.TOP)
                    topAlignedComponentIndices.push(i)
            })

            return boundaries
        }

        focus(componentID: number, hideOthers: boolean = true) {
            this.components.forEach(component => component.hide())
            this.components[componentID].unHide()

            this.currentComponentID = componentID
        }

        startup() {
            super.startup()
        }

        draw() {
            super.draw()

            this.components.forEach(component => {
                if (!component.isHidden())
                    component.draw()
            })
        }
    }
}