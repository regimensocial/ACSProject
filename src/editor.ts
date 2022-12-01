// This is the editor part of the application. It is used to edit the notes.

import MyElement from "./elementTypes/MyElement";
import { State, StringDict } from "./helpers";

// this is the interface for the editor elements
interface EditorElements {
    [key: string]: { // below are the attributes of the editor elements
        text: string; // styling will be an array of specific strings
        styling?: ( // stylings (from SC 10.4)
            `colour-${string}`|
            "bold"|
            "italic"|
            "subscript"|
            "superscript"|
            "normal"
        )[],
    }; 
}


class Editor {

    public noteID: String;
    private element: HTMLElement;

    public main(): void {
        console.log("Editor started");
    }

    // This implements the EditorElements interface
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

    private renderedData: State = {};

    // This function is used to render the editor
    public generateElement(location: string): HTMLElement {

        

        // loop through the data and render it
        Object.keys(this.data).forEach((key) => {
            // create span using inbuilt functions, fill with text, add to this.renderedData
            var span = document.createElement("span");
            
            // Adding the id to the span as a dataset property so we can keep track
            span.dataset.key = key
            
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
            this.renderedData[key] = span;
        });

        console.log(this.renderedData);

        // loop through the data and replace the placeholders with the rendered data
        Object.keys(this.renderedData).forEach((key) => {
            
            var text = this.renderedData[key].innerHTML;

            // find any placeholders, replace them with the rendered data
            // TODO: make this more efficient
            Object.keys(this.renderedData).forEach((key) => {
                if (text.includes(`{${key}}`)) text = text.replace(`{${key}}`, this.renderedData[key].outerHTML);
            });

            this.renderedData[key].innerHTML = text;

        });

        // generate element from the rendered data
        // render into provided location
        this.element = new MyElement({
            className: "editorMain",
            type: "div",
            attributes: {
                contentEditable: "true",
            },
            content: this.renderedData["1"]
        }).generateElement(location);

        // this is for selection via the mouse
        this.element.onmouseup = (event) => {
            
            // get the selected text
            var selection = window.getSelection();
            
            // this is the range of the selection
            var range = selection.getRangeAt(0);

            // this is a clone of the contents, so we can observe it
            var clone = range.cloneContents();

            console.log(clone);
            // make copy of clone and set to clone
            clone = (clone.cloneNode(true) as DocumentFragment);
            // this is the parent of element that the selection is in
            var firstParent = (range.commonAncestorContainer);

            if (range.commonAncestorContainer.nodeType === Node.TEXT_NODE) {
                firstParent = range.commonAncestorContainer.parentElement as HTMLElement;
            } else {
                firstParent = firstParent as HTMLElement;
            }

            var newClone;

            // get all parents until .editorMain and wrap them around the clone
            while (firstParent && (firstParent as HTMLElement).classList && !(firstParent as HTMLElement).classList.contains("editorMain")) {
                var newParent = document.createElement((firstParent as HTMLElement).tagName);
                newParent.dataset.key = (firstParent as HTMLElement).dataset.key;
                var thingToAppend = newClone ? newClone : clone;
                newParent.appendChild(thingToAppend);
                newClone = (newParent);
                firstParent = firstParent.parentElement;
            }

            console.log(newClone);


            
        };

        return this.element;
    }

    public constructor({
        
    }) {
        console.log("Editor initialised");
    }
}

export default Editor;