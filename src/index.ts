import Button from "./elementTypes/Button";
import MyElement from "./elementTypes/MyElement";
import MyElementWithState from "./elementTypes/MyElementWithState";
import Flashcard from "./Flashcard";
import "./index.scss";
import About from "./menus/About";
import FlashcardCreation from "./menus/FlashcardCreation";
import Flashcards from "./menus/Flashcards";
import FlashcardView from "./menus/FlashcardView";
import MainMenu from "./menus/MainMenu";
import Notes from "./menus/Notes";

class App {
    public constructor() { // This is the constructor of the class, will run when the application is started.
        console.log("App initialised");
        this.loadFlashcards();
    }

    // This is where flashcards are stored
    public flashcards = [] as Flashcard[];

    // This saves the flashcards to local storage
    public saveFlashcards() {
        localStorage.setItem("flashcards", JSON.stringify(this.flashcards));
    }

    // This loads the flashcards from local storage
    public loadFlashcards() {
        var cards = localStorage.getItem("flashcards");
        this.flashcards = [];

        if (cards === null) return; // If there are no flashcards, then return (don't do anything

        var allCards = JSON.parse(cards);
        var tempCards = [] as Flashcard[]

        // We have to do something special to convert the JSON into Flashcard objects
        allCards.forEach((card: any) => {
            const flashcard = new Flashcard(card._id, card.front, card.back, card.tags);
            flashcard.setFromLocalStorage(card);
            tempCards.push(flashcard);
        });

        this.flashcards = tempCards as Flashcard[];

        console.log(allCards, this.flashcards);
    }

    public main(): void { // This is the main function that is called when the application is started.
        console.log("App started");

        var menuProps = {
            // change current menu
            changeMenu: (menuName: string) => {

                // if the menu is a flashcard menu, then rerender
                if (menuName.includes("flashcard")) {
                    render();
                }

                menu.content = generatedMenus[menuName];



            },
            hideMenus: () => {
                // hide all menus
                menu.styling = {
                    ...menu.styling,
                    display: "none"
                };
            },
            showMenus: () => {
                // show all menus
                menu.styling = {
                    ...menu.styling,
                    display: "block"
                };
            },
        };

        var menuContents: any = {};
        var generatedMenus: any = {};

        function render() {

            menuContents = { // This is the contents of the menu, used to switch
                main: MainMenu(menuProps),
                about: About(menuProps),
                notes: Notes(menuProps),
                flashcards: Flashcards(menuProps),
                makeFlashcard: FlashcardCreation(menuProps),
                viewFlashcard: FlashcardView(menuProps)
            };

            // pre-generate the menus
            Object.keys(menuContents).forEach((menuName) => {
                generatedMenus[menuName] = new MyElement({ // need a container for the menu
                    className: "menu",
                    type: "div",
                    content: menuContents[menuName]
                }).generateElement(); // generating the element (returns HTMLElement)
            });
        }

        render();

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

let app: App;
window.addEventListener("DOMContentLoaded", (e: Event) => { // This is the entry point of the application. It is called when the DOM is ready.
    app = new App(); // Creating a new instance of the app class.
    app.main(); // Calling the main method of the app class.
});

export { app };