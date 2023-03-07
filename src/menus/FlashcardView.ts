import { app } from "..";
import Button from "../elementTypes/Button";
import MyElement from "../elementTypes/MyElement";
import Flashcard from "../Flashcard";
import { State } from "../helpers";

function setFlashcardInfoElementContent(flashcards = [] as Flashcard[], element: MyElement, selectedCard: String, selectedTag: String) {
    var card = flashcards.find((card) => card.id === selectedCard);
    console.log(card);
    element.content = [
        // Deselect button
        new Button({
            className: "button",
            content: "Desel",
            func: () => {
                selectedCard = null;
                setFlashcardElementContent(flashcards, element, selectedCard, selectedTag);
            }
        }),
        // Show the info about the selected flashcard
        new MyElement({
            className: "flashcardInfoList",
            type: "ul",
            content: [
                new MyElement({
                    className: "flashcardInfo",
                    type: "li",
                    content: "Front: " + card.front
                }),
                new MyElement({
                    className: "flashcardInfo",
                    type: "li",
                    content: "Back: " + card.back
                }),
                new MyElement({
                    className: "flashcardInfo",
                    type: "li",
                    content: "Tags: " + card.tags.join(", ")
                }),
                new MyElement({
                    className: "flashcardInfo",
                    type: "li",
                    content: "Type: " + card.type
                }),
                new MyElement({
                    className: "flashcardInfo",
                    type: "li",
                    content: "Next due: " + card.dueDate.toLocaleString()
                }),
            ]
        }),
    ]
}

function setFlashcardElementContent(flashcards = [] as Flashcard[], element: MyElement, selectedCard: String, selectedTag: String) {
    console.log(flashcards)
    element.content = [
        new MyElement({
            className: "textInfo",
            type: "div",
            content: "Select a flashcard to view its info"
        }),
        new MyElement({
            className: "flashcardList",
            type: "ul",
            // Loop through all flashcards and create a list item for each one
            content: flashcards.map((flashcard) => {
                return new MyElement({
                    className: "flashcard",
                    type: "li",
                    content: flashcard.front,
                    events: {
                        "click": () => {
                            selectedCard = flashcard.id;
                            selectedTag = null;
                            setFlashcardInfoElementContent(flashcards, element, selectedCard, selectedTag);
                        }
                    }
                })
            })
        })
    ]
}

// export the function returning array of MyElements
export default (props: State) => {

    // Selected card and tags stored here
    var selectedCard = null;
    var selectedTag = null;

    // This is the list of flashcards
    var flashcardElement = new MyElement({
        className: "flashcard",
        type: "div",
        content: "",
        styling: {
            // If there is a selected card, hide this element
            "display": (selectedCard) ? "none" : ""
        }
    });

    // This is the info about the selected flashcard
    var flashcardInfoElement = new MyElement({
        className: "flashcardInfo",
        type: "div",
        content: "",
        styling: {
            // If there is no selected card, hide this element
            "display": (!selectedCard) ? "none" : ""
        }
    });

    // Initial content
    setFlashcardElementContent(app.flashcards, flashcardElement, selectedCard, selectedTag);

    // returning contents of the menu
    return [
        new MyElement({
            className: "title",
            type: "div",
            content: "Viewing Flashcards",
        }),
        new Button({
            className: "button",
            content: "Back",
            func: () => {
                props.changeMenu("flashcards");
            }
        }),
        new MyElement({
            className: "mainContent",
            type: "div",
            content: [
                flashcardElement,
                flashcardInfoElement
            ]
        }),
    ]

}