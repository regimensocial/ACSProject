// This is the editor part of the application. It is used to edit the notes.

import MyElement from "./elementTypes/MyElement";
import { State, StringDict } from "./helpers";



class Editor {

    public noteID: String;
    private element: HTMLElement;

    public main(): void {
        console.log("Editor started");
    }

    // Example data for now
    private data: State = {
        "1": {
            text: "The quick {2} the lazy dog.",
        },
        "2": {
            text: "brown {3} jumps over",
        },
        "3": {
            text: "fox",
        }
    }

    public generateElement(location: string): HTMLElement {

        var renderedData: State = {};

        // loop through the data and render it
        Object.keys(this.data).forEach((key) => {
            // create span use inbuilt functions, fill with text, add to renderedData
            var span = document.createElement("span");
            span.innerText = this.data[key].text;
            renderedData[key] = span;
        });

        console.log(renderedData);

        // loop through the data and replace the placeholders with the rendered data
        Object.keys(renderedData).forEach((key) => {
            
            var text = renderedData[key].innerHTML;

            // find any placeholders, replace them with the rendered data
            // TODO: make this more efficient
            Object.keys(renderedData).forEach((key) => {
                if (text.includes(`{${key}}`)) text = text.replace(`{${key}}`, renderedData[key].outerHTML);
            });

            renderedData[key].innerHTML = text;

        });

        // generate element from the rendered data
        // render into provided location
        this.element = new MyElement({
            className: "editorMain",
            type: "div",
            attributes: {
                contentEditable: "true",
            },
            content: renderedData["1"]
        }).generateElement(location);

        return this.element;
    }

    public constructor({
        
    }) {
        console.log("Editor initialised");
    }
}

export default Editor;