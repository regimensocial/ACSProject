import Button from "./elementTypes/Button";
import MyElement from "./elementTypes/MyElement";
import MyElementWithState from "./elementTypes/MyElementWithState";
import "./index.scss";

class App {
    public constructor() { // This is the constructor of the class, will run when the application is started.
        console.log("App initialised");
    }

    public main(): void { // This is the main function that is called when the application is started.
        console.log("App started");

        // var temp = new MyElementWithState({
        //     className: "my-element",
        //     type: "div",
        //     content: "Hello",
        //     attributes: {
        //         "title": "This is a test",
        //     },
        //     events: {
        //         "click": () => { // on first click, log "Command 1", on second (and all other) clicks, log "Command 2
        //             console.log("Command 1, changing");
        //             temp.events = {
        //                 "click": () => {
        //                     console.log("Command 2");
        //                     // add 1 to state on this event listener
        //                     temp.state.test = temp.state.test + 1;
        //                     console.log(temp.state.test);
        //                     temp.content = (temp.state.test).toString();
        //                 }
        //             }
        //         }
        //     },
        //     state: {
        //         "test": 1,
        //     },
        // });


        var temp2 = new MyElement({
            className: "my-element",
            type: "div",
            content: [
                new MyElement({
                    className: "my-element",
                    type: "div",
                    content: "Hello",
                }),
                new MyElement({
                    className: "my-element",
                    type: "div",
                    content: "World",
                }),
            ],
            attributes: {
                "title": "This is a test",
            }
        });

        // temp2.generateElement("#main");

        // var buttonTest = new Button({
        //     className: "button-test",
        //     content: "Click me",
        //     func: () => {
        //         buttonTest.func = () => {
        //             console.log("Command 2");
        //         }
        //     }
        // });

        // buttonTest.generateElement("#main");

        var textInput = new MyElementWithState({ // Will use state for the value of the input
            className: "text-input",
            type: "input",
            attributes: {
                "type": "text",
            },
            content: "",
            events: {
                "input": (e: Event) => {
                    textInput.state.value = (e.target as HTMLInputElement).value.toString();
                    console.log(textInput.state.value);
                }
            },
            state: {
                "value": "",
            }
        });

        
        textInput.generateElement("#main");



    }
}

window.addEventListener("DOMContentLoaded", (e: Event) => { // This is the entry point of the application. It is called when the DOM is ready.
    const app = new App(); // Creating a new instance of the app class.
    app.main(); // Calling the main method of the app class.
});
