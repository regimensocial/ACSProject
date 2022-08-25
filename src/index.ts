import MyElement from "./elementTypes/MyElement";
import "./index.scss";

class App {
    public constructor() {
        console.log("App initialized");
    }

    public main(): void {
        console.log("App started");
        var temp = new MyElement("my-element", "div", "Hello World", {}, {});

    }
}

window.addEventListener("DOMContentLoaded", (e: Event) => { // This is the main entry point of the application. It is called when the DOM is ready.
    const app = new App();
    app.main();
});
