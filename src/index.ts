import Button from "./elementTypes/Button";
import MyElement from "./elementTypes/MyElement";
import MyElementWithState from "./elementTypes/MyElementWithState";
import "./index.scss";
import About from "./menus/About";
import MainMenu from "./menus/MainMenu";
import Notes from "./menus/Notes";

class App {
    public constructor() { // This is the constructor of the class, will run when the application is started.
        console.log("App initialised");
    }

    public main(): void { // This is the main function that is called when the application is started.
        console.log("App started");

        var menuProps = {
            // change current menu
            changeMenu: (menuName: string) => {
                menu.content = generatedMenus[menuName];
            },
            hideMenus: () => {
                // hide all menus
                menu.styling = {...menu.styling,
                    display: "none"
                };
            }
        };

        var menuContents : { [key: string]: MyElement[] } = { // This is the contents of the menu, used to switch
            main: MainMenu(menuProps),
            about: About(menuProps),
            notes: Notes(menuProps)
        };

        var generatedMenus : { [key: string]: HTMLElement } = {};

        // pre-generate the menus
        Object.keys(menuContents).forEach((menuName) => {
            generatedMenus[menuName] = new MyElement({ // need a container for the menu
                className: "menu",
                type: "div",
                content: menuContents[menuName]
            }).generateElement(); // generating the element (returns HTMLElement)
        });


        // Make a menu
        var menu = new MyElementWithState({
            className: "menuContainer",
            type: "div",
            content: "Loading...",
        });


        menu.generateElement("#main"); // generate the menu element and put it in the #main element.

        menu.content = generatedMenus.main;
    }
}

window.addEventListener("DOMContentLoaded", (e: Event) => { // This is the entry point of the application. It is called when the DOM is ready.
    const app = new App(); // Creating a new instance of the app class.
    app.main(); // Calling the main method of the app class.
});
