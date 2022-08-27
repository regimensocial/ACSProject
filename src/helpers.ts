// This file will contain the helper functions/interfaces/types that will be used in the application.

interface StringDict {
    [key: string]: string; // A simple string dictionary, used for properties that have string keys and string values.
}

interface EventDict {
    [key: string]: Function; // This is a dictionary of events and functions.
}

export { // Must export so other files can use the functions/interfaces/types.
    StringDict,
    EventDict
}