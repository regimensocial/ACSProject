// This file will contain the helper functions/interfaces/types that will be used in the application.

import MyElement from "./elementTypes/MyElement";

interface StringDict {
    [key: string]: string; // A simple string dictionary, used for properties that have string keys and string values.
}

interface EventDict {
    [key: string]: Function; // This is a dictionary of events and functions.
}

interface State {
    [key: string]: any; // should be addressed by a string, can be any value
}

// this is the type that can be used for the content of a MyElement
type MyElementContent = string | MyElement | HTMLElement | MyElementContent[];

var randomID = (repeatList?: string[]): string => {
    // generate initial random ID
    var temp = Math.random().toString(36).substring(2, 9);

    // check if the ID is already in the list of IDs
    while (repeatList && repeatList.length > 0 && repeatList.includes(temp)) {
        temp = Math.random().toString(36).substring(2, 9);
    }

    return temp // Generates a random ID, used for the ID of the elements.
}

export { // Must export so other files can use the functions/interfaces/types.
    StringDict,
    EventDict,
    State,
    MyElementContent,
    randomID
}