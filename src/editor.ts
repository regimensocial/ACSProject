// This is the editor part of the application. It is used to edit the notes.

import MyElement from "./elementTypes/MyElement";
import { State, StringDict } from "./helpers";

interface EditorElement {
    text: string; // styling will be an array of specific strings
    styling?: (
        `colour-${string}`|
        "bold"|
        "italic"|
        "subscript"|
        "superscript"|
        "normal"
    )[],
}

interface EditorElements {
    [key: string]: EditorElement; // should be addressed by a string, can be any value
}


class Editor {

    public noteID: String;
    private element: HTMLElement;

    public main(): void {
        console.log("Editor started");
    }

    // Example data for now
    private data: EditorElements = {
        "1": {
            text: "The quick {2} the lazy dog.",
        },
        "2": {
            text: "brown {3} jumps over",
            // adding style to the data
            styling: [
                "bold"
            ],
        },
        "3": {
            text: "f{4}",
            // adding style to the data
            styling: [
                "colour-blue"
            ]
        },
        "4": {
            text: "ox",
            // adding style to the data
            styling: [
                "normal"
            ]
        }
    }

    public generateElement(location: string): HTMLElement {

        var renderedData: State = {};

        // loop through the data and render it
        Object.keys(this.data).forEach((key) => {
            // create span use inbuilt functions, fill with text, add to renderedData
            var span = document.createElement("span");
            var elemInfo = this.data[key]
            span.innerText = elemInfo.text;
            // add a class so I can specifically style the note spans
            span.classList.add("element");
            // iterate through the styling and add the classes (except colour)
            if (elemInfo.styling) elemInfo.styling.forEach((style: string) => {
                if (style.startsWith("colour-")) {
                    // so colouring is a special case, we need to add the colour to the span
                    // because it wouldn't make sense to add a class for every colour
                    span.style.color = style.replace("colour-", "");
                } else {
                    span.classList.add(style);
                }
            })
            // add the span to the rendered data
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