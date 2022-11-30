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
            // create span use inbuilt functions, fill with text, add to this.renderedData
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

        // prevent user from editing the note by preventing default when they try to change the text
        
        // this.element.onmousedown = (event) => {

        //     // clear the selected elements
        //     selectedElements = [];

        //     // // get element mouse is down on
        //     // // var element = event.target as HTMLElement;
        //     // selectedElements.push(this.element);
        // };

        document.onmouseup = (event) => {
            
            // get the selected elements and delete them 

            // get the selected text
            var selection = window.getSelection();

            if (selection.rangeCount === 0) return

            var range = selection.getRangeAt(0);

            // clone contents but we need the first element to have the same styling and class as the parent
            var clone = range.cloneContents();
            
            // check if first node is element or text or if it's a single node
            
            if (clone.childNodes[0] && clone.childNodes.length === 1) {
                // if it's text, put it in a div with the same class name and styling as the parent
                console.log("here")
                // clone the parent without using cloneNode because it doesn't work
                var parent = (range.commonAncestorContainer.parentElement as HTMLElement);
                var newParent = document.createElement(parent.tagName);
                newParent.className = parent.className;
                newParent.dataset.key = parent.dataset.key;
                
                // add the whole clone to the parent clone
                newParent.appendChild(clone);

                console.log(newParent);
                
            } else if ( clone.childNodes[0] && clone.childNodes[0].nodeType === Node.TEXT_NODE) {
                // clone the parent without using cloneNode because it doesn't work
                var parent = (range.commonAncestorContainer as HTMLElement);
                var newParent = document.createElement(parent.tagName);
                newParent.className = parent.className;
                newParent.dataset.key = parent.dataset.key;
                
                // add the whole clone to the parent clone
                newParent.appendChild(clone);

                console.log(newParent);
            } else {
                console.log(clone);
            }
        };

        return this.element;
    }

    public constructor({
        
    }) {
        console.log("Editor initialised");
    }
}

export default Editor;