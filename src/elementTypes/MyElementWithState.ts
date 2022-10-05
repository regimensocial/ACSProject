import { EventDict, State, StringDict } from "../helpers";
import MyElement from "./MyElement";

class MyElementWithState extends MyElement { // an element which can store variables in its state
    private _state: State; // the state property, shouldn't be directly addressed, use the getter and setter instead.

    get state(): State {
        return this._state;
    }

    set state(state: State) {
        this._state = state;
    }


    public constructor(data: { // these are the same as in the MyElement class, but with the addition of the state property.
        className?: string,
        type: string,
        events?: EventDict,
        content: string | MyElement | MyElement[],
        attributes?: StringDict,
        styling?: StringDict,
        state?: State
    }) {
        super(data);
        this._state = data.state || {};
    }

}

export default MyElementWithState; // must export so other files can use the class.