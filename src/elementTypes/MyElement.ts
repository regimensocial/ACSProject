import { StringDict } from "../helpers";

class MyElement {

    className: string;
    type: string;
    content!: string | MyElement;
    attributes: StringDict;
    styling: StringDict;

    private element: HTMLElement;

    generateElement(location?: string): HTMLElement {

        if (this.element && location) {
            throw new Error("Element already exists");
        }

        this.element = document.createElement(this.type);
        
        if (this.className) this.element.className = this.className;
        
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

    constructor(className: string, type: string, content: string | MyElement, attributes: StringDict, styling: StringDict) { // This gives all the values to the properties of the class so that they can be used
        this.className = className; 
        this.type = type;
        this.content = content;
        this.attributes = attributes;
        this.styling = styling;
    }
}

export default MyElement;
