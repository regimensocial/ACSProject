import { EventDict, StringDict } from "../helpers";

class MyElement {

    className!: string; // element class
    type: string; // what element to generate, i.e., div, span, etc.
    _content!: string | MyElement; // content, either string or another MyElement
    _attributes!: StringDict; // any attributes
    _styling!: StringDict; // any CSS styling
    _events!: EventDict; // any events

    private element: HTMLElement; // this is where the actual element will be stored

    get content(): string | MyElement {
        return this._content;
    }

    set content(content: string | MyElement) {
        if (typeof content !== "string") {
            content = content.toString();
        }
        this._content = content;
        this.generation("content");
    }

    get attributes(): StringDict {
        return this._attributes;
    }

    // take in new attributes value and update the element
    set attributes(attributes: StringDict) {
        this._attributes = attributes;
        this.generation("attributes");
    }

    get styling(): StringDict {
        return this._styling;
    }

    // take in new styles value and update the element
    set styling(styling: StringDict) {
        this._styling = styling;
        this.generation("styling");
    }

    get events(): EventDict {
        return this._events;
    }

    // take in new events value and update the element
    set events(events: EventDict) {
        this._events = events;
        this.generation("events");
    }

    private generation(aspect?: string) {
        // generate each feature separately

        this.element = this.element || document.createElement(this.type);

        switch (aspect) {
            case "content":
                if (typeof this._content === "string") {
                    this.element.innerHTML = this._content;
                } else {
                    this.element.appendChild(this._content.generateElement());
                }

                break;
            
            case "attributes":
                for (let key in this.attributes) {
                    this.element.setAttribute(key, this.attributes[key]);
                }

                break;

            case "styling":
                if (this.styling) Object.keys(this.styling).forEach(styling => {
                    if (typeof styling === "string") {
                        this.element.style[(styling as any)] = this.styling[styling];
                    }
                });

                break;
            
            case "events":
                if (this.events) {
                    
                    Object.keys(this.events).forEach(event => {
                        var funcName = "on" + event;
                        this.element[(funcName)] = (this.events[event] as any);
                    }
                    
                    // for (let event in this.events) {
                    //     this.element.addEventListener(event, () => this.events[event]());
                    //     this.element["on" + event] = () => this.events[event]();
                    // }
                }

                break;

            case "all":
                console.log("first gen");
                this.generation("content");
                this.generation("attributes");
                this.generation("styling");
                this.generation("events");
                break;

            default:
                break;
        }
        
    }

    // LATER, MAKE EACH GENERATION BIT ITS OWN METHOD, GENERATEELEMENT WILL USE THESE METHODS TO GENERATE THE ELEMENT, AND THEN APPEND IT TO THE LOCATION. MORE MEMORY EFFICIENT.

    generateElement(location?: string): HTMLElement {

        // If a new location is specified after the element is already generated, an error will be thrown.
        if (this.element && location) {
            throw new Error("Element already exists");
        }

        // // If element already exists, replace it with a new element we can work on now
        // if (this.element) {
        //     var newElement = document.createElement(this.type);
        //     this.element.replaceWith(newElement);
        //     this.element = newElement;
        // } else { // If element doesn't exist, create a new one
        //     this.element = document.createElement(this.type);
        // }

        this.element = this.element || document.createElement(this.type);

        // Add the class name to the element if it exists.
        if (this.className) this.element.className = this.className;
        
        this.generation("all");

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
        this._events = data.events;
        this._content = data.content;
        this._attributes = data.attributes;
        this._styling = data.styling;
    }
}

export default MyElement;
