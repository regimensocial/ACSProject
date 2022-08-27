import MyElement from "./elementTypes/MyElement";
import MyElementWithState from "./elementTypes/MyElementWithState";
import "./index.scss";

class App {
    public constructor() { // This is the constructor of the class, will run when the application is started.
        console.log("App initialised");
    }

    public main(): void { // This is the main function that is called when the application is started.
        console.log("App started");

        var temp = new MyElementWithState({
            className: "my-element",
            type: "div",
            content: "Hello",
            attributes: {
                "title": "This is a test",
            },
            events: {
                "click": () => {
                    temp.state.test++;
                    console.log(temp.state.test);
                    temp.content = (temp.state.test).toString();
                }
            },
            state: {
                "test": 1,
            },
        });


        var temp2 = new MyElement({
            className: "my-element",
            type: "div",
            content: temp,
            attributes: {
                "title": "This is a test",
            }
        });

        temp2.generateElement("#main");

    }
}

window.addEventListener("DOMContentLoaded", (e: Event) => { // This is the entry point of the application. It is called when the DOM is ready.
    const app = new App(); // Creating a new instance of the app class.
    app.main(); // Calling the main method of the app class.
});
