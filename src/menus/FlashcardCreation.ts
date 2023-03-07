import { app } from "..";
import Button from "../elementTypes/Button";
import MyElement from "../elementTypes/MyElement";
import Flashcard from "../Flashcard";
import { State } from "../helpers";


// export the function returning array of MyElements
export default (props: State) => {

    // where input data will be stored
    var data = {
        type: "basic",
        front: "",
        back: "",
        tags: [] as string[],
    }

    // returning contents of the menu
    return [
        new MyElement({
            className: "title",
            type: "div",
            content: "Make a Flashcard",
        }),
        new Button({
            className: "button",
            content: "Cancel",
            func: () => {
                props.changeMenu("flashcards");
            }
        }),
        new Button({
            className: "button",
            content: "Save",
            func: () => {
                // First perform validation
                // These can't be empty
                if (data.front === "" || data.back === "") return;

                // Make a new flashcard
                var card = new Flashcard(data.front, data.back, data.tags, data.type as "basic" | "basicReverse" | "basicTyped");
                
                // Add it to the app
                app.flashcards.push(card);
                app.saveFlashcards();

                // Go back to the flashcards menu
                props.changeMenu("flashcards");

            }
        }),
        
        // make front, back, and tags, along with a type drop down (basic, basicReverse, basicTyped)
        new MyElement({
            className: "flashcardForm",
            type: "div",
            content: [
                new MyElement({
                    className: "input",
                    type: "select",
                    content: [
                        new MyElement({
                            className: "option",
                            type: "option",
                            content: "Basic",
                            attributes: {
                                value: "basic"
                            }
                        }),
                        new MyElement({
                            className: "option",
                            type: "option",
                            content: "Basic Reverse",
                            attributes: {
                                value: "basicReverse"
                            }
                        }),
                        new MyElement({
                            className: "option",
                            type: "option",
                            content: "Basic Typed",
                            attributes: {
                                value: "basicTyped"
                            }
                        }),
                    ],
                    events: {
                        "change": (e: Event) => {
                            data.type = (e.target as HTMLSelectElement).value;
                            console.log(data)
                        }
                    }
                }),
                new MyElement({
                    className: "inputBox",
                    type: "div",
                    content: [
                        "Front ",
                        new MyElement({
                            className: "front",
                            type: "input",
                            content: "Front",
                        }),
                    ],
                    events: {
                        "change": (e: Event) => {
                            data.front = (e.target as HTMLSelectElement).value;
                            console.log(data)
                        }
                    }
                }),
                new MyElement({
                    className: "inputBox",
                    type: "div",
                    content: [
                        "Back ",
                        new MyElement({
                            className: "back",
                            type: "input",
                            content: "Back",
                        }),
                    ],
                    events: {
                        "change": (e: Event) => {
                            data.back = (e.target as HTMLSelectElement).value;
                            console.log(data)
                        }
                    }
                }),
                new MyElement({
                    className: "inputBox",
                    type: "div",
                    content: [
                        "Tags ",
                        new MyElement({
                            className: "tags",
                            type: "input",
                            content: "Tags",
                        }),
                    ],
                    events: {
                        "change": (e: Event) => {
                            data.tags = (e.target as HTMLSelectElement).value.split(" ");
                            console.log(data)
                        }
                    }
                }),
            ]

        }),
        
        new MyElement({
            className: "helpText",
            type: "div",
            content: "For tags, please separate each tag with a space. Please remember they are case sensitive."
        })

    ]

}