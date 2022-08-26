import MyElement from "./elementTypes/MyElement";
import "./index.scss";

class App {
    public constructor() {
        console.log("App initialised");
    }

    public main(): void {
        console.log("App started");

        var temp = new MyElement(
            "my-element", 
            "div", 
            "Hello World", 
            {
                "title": "This is a test",
            }, 
            {
                "color": "cyan",
                "font-size": "20px",
                "font-weight": "bold"
            }
        );

        temp.generateElement("#main");
    }
}

window.addEventListener("DOMContentLoaded", (e: Event) => { // This is the main entry point of the application. It is called when the DOM is ready.
    const app = new App(); // Creating a new instance of the app class.
    app.main(); // Calling the main method of the app class.
});
