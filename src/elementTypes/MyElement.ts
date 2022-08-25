import { StringDict } from "../helpers";

class MyElement {

    id: string;
    type: string;
    content!: string | MyElement[];
    attributes: StringDict;
    styling: StringDict;

    generateElement(): HTMLElement {
        let element = document.createElement(this.type);
        // element.id = this.id;
        // element.innerHTML = this.content;
        // for (let key in this.attributes) {
        //     element.setAttribute(key, this.attributes[key]);
        // }
        // for (let key in this.styling) {
        //     element.style[key] = this.styling[key];
        // }
        return null;
    }

    constructor(id: string, type: string, content: string | MyElement[], attributes: StringDict, styling: StringDict) {
        this.id = id;
        this.type = type;
        this.content = content;
        this.attributes = attributes;
        this.styling = styling;
    }
}

export default MyElement;
