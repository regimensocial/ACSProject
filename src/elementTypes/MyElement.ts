import { EventDict, StringDict } from "../helpers";

class MyElement {

    className!: string; // element class
    type: string; // what element to generate, i.e., div, span, etc.
    _content!: string | MyElement; // content, either string or another MyElement
    attributes!: StringDict; // any attributes
    styling!: StringDict; // any CSS styling
    events!: EventDict; // any events

    private element: HTMLElement; // this is where the actual element will be stored

    get content(): string | MyElement {
        return this._content;
    }

    set content(content: string | MyElement) {
        if (typeof content !== "string") {
            content = content.toString();
        }
        this._content = content;
        this.generateElement();
    }

    generateElement(location?: string): HTMLElement {

        // If a new location is specified after the element is already generated, an error will be thrown.
        if (this.element && location) {
            throw new Error("Element already exists");
        }

        // If element already exists, replace it with a new element we can work on now
        if (this.element) {
            var newElement = document.createElement(this.type);
            this.element.replaceWith(newElement);
            this.element = newElement;
        } else { // If element doesn't exist, create a new one
            this.element = document.createElement(this.type);
        }
        
        // If events are passed, add them to the element.
        if (this.events) for (let event in this.events) {
            
            this.element.addEventListener(event, () => this.events[event]());
        }

        // Add the class name to the element if it exists.
        if (this.className) this.element.className = this.className;
        
        // check if _content is String or MyElement
        if (typeof this._content === "string") {
            this.element.innerHTML = this._content;
        } else  {
            this.element.appendChild(this._content.generateElement());
        }
        // add attributes
        for (let key in this.attributes) {
            this.element.setAttribute(key, this.attributes[key]);
        }
        
        // add styling
        if (this.styling) Object.keys(this.styling).forEach(styling => {
            if (typeof styling === "string") {
                this.element.style[(styling as any)] = this.styling[styling];
            }
        });

        // check if location is defined, then place element in location
        if (location) {
            document.querySelector(location).appendChild(this.element);
        }

        return this.element;

    }

    makeRed(): void {
        this.element.style.color = "red";
    }

    constructor(data: { // passing an object to the constructor, containing all the data needed to generate the element. Done like this to allow for flexibility.
        className?: string, 
        type: string, 
        events?: EventDict,
        content: string | MyElement, 
        attributes?: StringDict, 
        styling?: StringDict
    }) { // This gives all the values to the properties of the class so that they can be used
        this.className = data.className; 
        this.type = data.type;
        this.events = data.events;
        this._content = data.content;
        this.attributes = data.attributes;
        this.styling = data.styling;
    }
}

export default MyElement;
