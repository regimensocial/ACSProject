import Button from "../elementTypes/Button";
import MyElement from "../elementTypes/MyElement";
import { State } from "../helpers";

// export the function returning array of MyElements
export default (props: State) => {
    return [
        new MyElement({
            className: "title",
            type: "div",
            content: "Notes",
        }),

        // container for the buttons
        new MyElement({
            className: "buttons",
            type: "div",
            content: [// new button for the notetaking side
                // back button
                new Button({
                    className: "button",
                    content: "Back",
                    func: () => {
                        props.changeMenu("main");
                    }
                }),
                new Button({
                    className: "button",
                    content: "Create",
                }),
                // new button for flashcards
                new Button({
                    className: "button",
                    content: "Delete",
                }),
                // new button for flashcards
                new Button({
                    className: "button",
                    content: "Info",
                }),
            ]
        }),

        // list of notes
        new MyElement({
            className: "notes",
            type: "p",
            content: "Notes will go here",
        })
    ]
}