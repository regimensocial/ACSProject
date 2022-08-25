import { StringDict } from "../helpers";

class MyElement {

    id: string;
    type: string;
    content!: string | MyElement;
    attributes: StringDict;
    styling: StringDict;

    private element: HTMLElement;

    generateElement(location?: string): HTMLElement {

        this.element = document.createElement(this.type);
        this.element.id = this.id;
        // check if content is String or MyElement
        if (typeof this.content === "string") {
            this.element.innerHTML = this.content;
        } else {
            this.element.appendChild(this.content.generateElement());
        }
        // add attributes
        for (let key in this.attributes) {
            this.element.setAttribute(key, this.attributes[key]);
        }
        // add styling
        if (this.styling) for (let style in Object.keys(this.styling)) {
            this.element.style[style] = this.styling[style];
        }

        if (location) {
            document.querySelector(location).appendChild(this.element);
            

        }

        return this.element;

    }

    makeRed(): void {
        this.element.style.color = "red";
    }

    constructor(id: string, type: string, content: string | MyElement, attributes: StringDict, styling: StringDict) {
        this.id = id;
        this.type = type;
        this.content = content;
        this.attributes = attributes;
        this.styling = styling;
    }
}

export default MyElement;
