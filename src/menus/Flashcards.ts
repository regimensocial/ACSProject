import Button from "../elementTypes/Button";
import MyElement from "../elementTypes/MyElement";
import { State } from "../helpers";


// export the function returning array of MyElements
export default (props: State) => {

    // returning contents of the menu
    return [
        new MyElement({
            className: "title",
            type: "div",
            content: "Flashcards",
        }),
        new Button({
            className: "button",
            content: "Back",
            func: () => {
                props.changeMenu("main");
            }
        }),
        new Button({
            className: "button",
            content: "New",
            func: () => {
                props.changeMenu("makeFlashcard");
            }
        }),
        new Button({
            className: "button",
            content: "View All",
            func: () => {
                props.changeMenu("viewFlashcard");
            }
        }),
    ]

}