// This is the editor part of the application. It is used to edit the notes.

import MyElement from "./elementTypes/MyElement";



class Editor {

    public noteID: String;
    private element: HTMLElement;

    public main(): void {
        console.log("Editor started");
    }

    public generateElement(): HTMLElement {
        this.element = new MyElement({
            className: "editor",
            type: "div",
            content: [
                new MyElement({
                    type: "span",
                    content: "example text"
                }),
            ]
        }).generateElement();

        return this.element;
    }

    public constructor({
        noteID = String,
        editorLocation = String,
    }) {
        console.log("Editor initialised");
    }
}