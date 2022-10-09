// this will be the basic button element

import { EventDict, State, StringDict } from "../helpers";
import MyElement from "./MyElement";
import MyElementWithState from "./MyElementWithState";

// this is the button element with a click event

class Button extends MyElementWithState {

    // get the func property
    get func(): Function {
        return this.events.click || null;
    }

    // set the func property
    set func(func: Function) {
        this.events = {...this.events, ...{
            click: func // add the click event to the events property
        }};
    }

    // return the disabled value
    get disabled() {
        return this.attributes.disabled || false;
    }

    // set disabled to whatever given
    set disabled(value: boolean) {
        this.attributes = {...this.attributes, ...{
            "disabled": value,
        }}
    };
    
    constructor(
        data: { // take in the same data as MyElementWithState except for the state property, func, and type property
            func?: Function,
            className?: string,
            content?: string | MyElement | MyElement[],
            attributes?: StringDict,
            styling?: StringDict,
            events?: EventDict,
        }
    ) {
        super({
            className: data.className,
            type: "button", // we set type permanently to button
            content: data.content || "Button",
            attributes: data.attributes || {},
            styling: data.styling || {},
            events: {...data.events, ...{
                PERMANENT_click: data.func // add the click event to the events property
            }},
        });

    
    }
}

export default Button;