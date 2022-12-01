// This is the editor part of the application. It is used to edit the notes.

import MyElement from "./elementTypes/MyElement";
import { State, StringDict } from "./helpers";

// this is the interface for the editor elements
interface EditorElements {
    [key: string]: { // below are the attributes of the editor elements
        text: string; // styling will be an array of specific strings
        styling?: ( // stylings (from SC 10.4)
            `colour-${string}` |
            "bold" |
            "italic" |
            "subscript" |
            "superscript" |
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

            // loop through the children of the clone
            for (var i = 0; i < clone.children.length; i++) {
                // get the child
                var child = (clone.children[i] as HTMLElement);

                 // if it's a text node, return
                if (child.nodeType === Node.TEXT_NODE) return;

                // get the key from the child
                var key = child.dataset.key;

                // for the sake of keeping a note of the selection, we'll add a dataset property
                child.dataset.selected = "true";

                // check if element is entirely selected
                var actualElement = this.renderedData[key];
                if (actualElement.textContent != child.textContent) {
                    child.dataset.partial = "true"; // if an element doesn't have this data attribute, it's the whole thing
                }
            }

            // this is the parent of element that the selection is in
            var firstParent = (range.commonAncestorContainer);

            // if the selection ancestor is just text, we want to get the parent
            if (range.commonAncestorContainer.nodeType === Node.TEXT_NODE) {
                firstParent = range.commonAncestorContainer.parentElement as HTMLElement;
            }

            // this will store the final element (at the highest level)
            var finalElement;

            // get all parents before .editorMain and wrap them around the clone
            while (firstParent && (firstParent as HTMLElement).classList && !(firstParent as HTMLElement).classList.contains("editorMain")) {
                // this clones the element (not using cloneNode because we don't want to clone the children)
                var newParent = document.createElement((firstParent as HTMLElement).tagName); // making a new element using the tag of the parent
                newParent.dataset.key = (firstParent as HTMLElement).dataset.key; // got to keep the key
                
                

                // set newParent classList to the firstParent classList
                (firstParent as HTMLElement).classList.forEach((className) => {
                    newParent.classList.add(className);
                });

                // for now, colour is the only style that needs to be copied
                (newParent).style.color = (firstParent as HTMLElement).style.color;
                

                // if we've already wrapped the first element, we don't want to wrap it again, wrap the previous element instead
                var thingToAppend = finalElement ? finalElement : clone;
                newParent.appendChild(thingToAppend);

                // get the actual element on the page to check if we have the whole thing
                // or just a part of it
                var actualElement = this.renderedData[(firstParent as HTMLElement).dataset.key];
                if (actualElement.textContent != newParent.textContent) {
                    newParent.dataset.partial = "true"; // if an element doesn't have this data attribute, it's the whole thing
                }

                // set the final element to the new parent
                finalElement = (newParent);

                // pass up the tree
                firstParent = firstParent.parentElement;
            }

            // this will print the final element
            console.log(finalElement);
        };

        return this.element;
    }

    public constructor({

    }) {
        console.log("Editor initialised");
    }
}

export default Editor;