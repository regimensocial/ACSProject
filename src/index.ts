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

        var buttonContainer = new MyElement({
            className: "buttons",
            type: "div",
            content: [// new button for the notetaking side
                new Button({
                    className: "button",
                    content: "Notes",
                }),
                // new button for flashcards
                new Button({
                    className: "button",
                    content: "Flashcards",
                    func: () => {
                        buttonContainer.content = [...(buttonContainer.content as MyElement[]),
                        new MyElementWithState({
                            className: "flashcard",
                            type: "div",
                            content: "Flashcard",
                        })];
                    }
                }),
            ]
        });

        // Make a menu
        var menu = new MyElementWithState({
            className: "menu",
            type: "div",
            content: [
                // new title H1
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
                buttonContainer
            ]
        }
        );

        menu.generateElement("#main"); // generate the menu element and put it in the #main element.

    }
}

window.addEventListener("DOMContentLoaded", (e: Event) => { // This is the entry point of the application. It is called when the DOM is ready.
    const app = new App(); // Creating a new instance of the app class.
    app.main(); // Calling the main method of the app class.
});
