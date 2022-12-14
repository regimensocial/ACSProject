import { EventDict, MyElementContent, State, StringDict } from "../helpers";

class MyElement {

    className!: string; // element class
    type: string; // what element to generate, i.e., div, span, etc.
    private _content!: MyElementContent; // content, either string or another MyElement, or a raw HTMLElement
    private _attributes!: State; // any attributes
    private _styling!: StringDict; // any CSS styling
    private _events!: EventDict; // any events

    public element: HTMLElement; // this is where the actual element will be stored


    private permanentEvents: EventDict = {}; // events that will be added to the element when it is generated, and will not be removed when new events are added

    get content(): MyElementContent {
        return this._content;
    }

    set content(content: MyElementContent) {
        if (!(content instanceof String) && !(content instanceof MyElement) && !(content instanceof Array) && !(content instanceof HTMLElement)) {
            content = content.toString();
        }
        this._content = content;
        this.generation("content");
    }

    get attributes(): State {
        return this._attributes;
    }

    // take in new attributes value and update the element
    set attributes(attributes: State) {
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
        Object.keys(this.events).forEach(event => {
            this.element.removeEventListener(event, (this.events[event] as any));
        });

        this._events = events;
        this.generation("events");
    }

    private generation(aspect?: string): void {
        // generate each feature separately

        this.element = this.element || document.createElement(this.type);

        switch (aspect) {
            case "content":
                if (typeof this._content === "string") {
                    this.element.innerHTML = this._content;
                } else if (this._content instanceof MyElement) {
                    this.element.innerHTML = "";
                    this.element.appendChild(this._content.generateElement());
                } else if (this._content instanceof HTMLElement) { // if its an HTMLElement, just replace the element with it 
                    this.element.innerHTML = "";
                    this.element.appendChild(this._content);
                } else if (this._content instanceof Array) {
                    // empty this.element contents
                    this.element.innerHTML = "";
                    this._content.forEach(element => {
                        if (!(element as MyElementContent)) throw "Content array must only contain MyElement objects";
                        
                        // render the element depending on its type
                        if (element instanceof MyElement) {
                            this.element.appendChild(element.generateElement());
                        } else if (element instanceof HTMLElement) {
                            this.element.appendChild(element);
                        } else if (typeof element === "string") {
                            this.element.innerHTML += element;
                        } else {
                            throw "Content array must only contain MyElement objects";
                        }
                    });
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
                    console.log("events gen");

                    // loop through each event key and add the event listener
                    Object.keys(this.events).forEach(event => {
                        if (event.startsWith("PERMANENT_")) { // if the event is a permanent event, and isn't already in the permanentEvents object add it
                            if (!this.permanentEvents[event]) this.permanentEvents[event] = this.events[event];
                            return; // don't add the event listener here, add it below
                        }
                        this.element.addEventListener(event, (this.events[event] as any));
                    });

                    // loop through each permanent event key and add the event listener
                    Object.keys(this.permanentEvents).forEach(event => {
                        this.element.addEventListener(event.replace("PERMANENT_", ""), (this.permanentEvents[event] as any));
                    });
                }

                break;

            case "all":
                console.log("first gen"); // this is just for debugging
                // generate all features
                ["content", "attributes", "styling", "events"].forEach(aspect => {
                    this.generation(aspect);
                });
                break;

            default:
                break;
        }

    }

    generateElement(location?: string): HTMLElement {

        // If a new location is specified after the element is already generated, an error will be thrown.
        if (this.element && location) {
            console.log(this.element, location);
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
            // replace the element with the new element
            document.querySelector(location).appendChild(this.element);
            // document.querySelector(location).replaceWith(this.element);
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
        content: MyElementContent,
        attributes?: State,
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
