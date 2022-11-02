import Button from "../elementTypes/Button";
import MyElement from "../elementTypes/MyElement";
import { State } from "../helpers";

// export the function returning array of MyElements
export default (props: State) => [
    new MyElement({
        className: "title",
        type: "div",
        content: "About",
    }),
    // back button
    new Button({
        className: "button",
        content: "Back",
        func: () => {
            props.changeMenu("main");
        }
    })
]