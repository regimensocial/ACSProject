// this will be the base class for all input elements

import { EventDict, State, StringDict } from "../helpers";
import MyElement from "./MyElement";
import MyElementWithState from "./MyElementWithState";

class InputElement extends MyElement {
    
    private _value: any; // the value of the input element

    set value(value: any) { // set the value of the input element
        this._value = value;
        (this.element as HTMLInputElement).value = value;
    }

    get value(): any { // get the value of the input element
        return this._value;
    }

    constructor(
        data: {
            className?: string,
            inputType?: "text"
            content?: string | MyElement | MyElement[],
            attributes?: StringDict,
            styling?: StringDict,
            events?: EventDict,
            state?: State,
        }
    ) {
        super({
            className: data.className,
            type: "input", // input elements only
            content: data.content,
            attributes: data.attributes,
            styling: data.styling,
            events: {
                ...data.events, ...{ // add the events from the data object, and add the input event
                    "PERMANENT_input": (e: Event) => {
                        this._value = (e.target as HTMLInputElement).value; // update the value stored in the class
                        console.log(this._value);
                    }
                },
            },
        });
    }
}

export default InputElement;
