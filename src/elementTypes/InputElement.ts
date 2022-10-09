// this will be the base class for all input elements

import { EventDict, State, StringDict } from "../helpers";
import MyElement from "./MyElement";
import MyElementWithState from "./MyElementWithState";

class InputElement extends MyElementWithState {
    constructor(
        data: {
            className?: string,
            inputType?: "text",
            content?: string | MyElement | MyElement[],
            attributes?: StringDict,
            styling?: StringDict,
            events?: EventDict,
            state?: State,
        }
    ) {
        super({
            className: data.className,
            type: "input",
            content: data.content,
            attributes: data.attributes,
            styling: data.styling,
            events: data.events,
            state: data.state,
        });
    }
}