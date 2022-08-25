import { StringDict } from "../helpers";

class MyElement {

    id: string;
    type: string;
    content!: string | MyElement;
    attributes: StringDict;
    styling: StringDict;

    generateElement(): HTMLElement {
        let element = document.createElement(this.type);
        element.id = this.id;
        // check if content is String or MyElement
        if (typeof this.content === "string") {
            element.innerHTML = this.content;
        } else {
            element.appendChild(this.content.generateElement());
        }
        // add attributes
        for (let key in this.attributes) {
            element.setAttribute(key, this.attributes[key]);
        }
        // add styling
        if (this.styling) for (let style in Object.keys(this.styling)) {
            element.style[style] = this.styling[style];
        }
        return element;

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
