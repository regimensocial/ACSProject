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


        var menuContents = { // This is the contents of the menu, used to switch
            main: [
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
                        }),
                        // new button for flashcards
                        new Button({
                            className: "button",
                            content: "Flashcards",
                        }),
                        new Button({
                            className: "button",
                            content: "About",
                            func : () => {
                                menu.content = menuContents.about;
                            }
                        }),
                    ]
                })
            ],
            about: [
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
                        menu.content = menuContents.main;
                    }
                })
            ]
        };

        // Make a menu
        var menu = new MyElementWithState({
            className: "menu",
            type: "div",
            content: "Loading...",
        });

        

        menu.generateElement("#main"); // generate the menu element and put it in the #main element.

        menu.content = menuContents.main;
    }
}

window.addEventListener("DOMContentLoaded", (e: Event) => { // This is the entry point of the application. It is called when the DOM is ready.
    const app = new App(); // Creating a new instance of the app class.
    app.main(); // Calling the main method of the app class.
});
