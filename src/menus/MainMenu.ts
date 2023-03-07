// Main Menu

import MyElement from "../elementTypes/MyElement";
import Button from "../elementTypes/Button";
import { State } from "../helpers";

// export the function returning array of MyElements
export default (props: State) => [
    new MyElement({
        className: "title",
        type: "div",
        content: "A Level Computer Science Project",
    }),
    // description
    new MyElement({
        className: "description",
        type: "div",
        content: "By Jamie Adams",
    }),
    // container for the buttons
    new MyElement({
        className: "buttons",
        type: "div",
        content: [// new button for the notetaking side
            new Button({
                className: "button",
                content: "Notes",
                func: () => {
                    props.changeMenu("notes");
                }
            }),
            // new button for flashcards
            new Button({
                className: "button",
                content: "Flashcards",
                func: () => {
                    props.changeMenu("flashcards");
                }
            }),
            new Button({
                className: "button",
                content: "About",
                func: () => {
                    props.changeMenu("about");
                }
            }),
        ]
    })
]


