// This is the editor part of the application. It is used to edit the notes.

import MyElement from "./elementTypes/MyElement";
import { State, StringDict } from "./helpers";

// stylings (from SC 10.4)
const ALL_STYLINGS = ['bold', 'italic', 'subscript', 'superscript', 'normal', 'selected'] as const;
// this variable is used to type the styling of the editor elements
// and for comparisons
type StylingTuple = typeof ALL_STYLINGS | `colour-${string}`;

// this is the actual type of the styling, it's an array of strings
type EditorElementStyling = StylingTuple[number][];

// this is the interface for the editor elements
interface EditorElements {
    [key: string]: { // below are the attributes of the editor elements
        text: string; // styling will be an array of specific strings
        styling?: EditorElementStyling;
    };
}


class Editor {

    public noteID: String;
    private element: HTMLElement;

    public main(): void {
        console.log("Editor started");
    }

    // This implements the EditorElements interface
    // It is used to store the data for the editor
    private _data: EditorElements = {
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

    // this will set our data and re-render the editor
    private set data(data: EditorElements) {
        // set the data
        this._data = data;
        // now render the editor
        this.render();
    }

    private renderedData: State = {};


    private setupSelection(): void {
        // clear selection

        this.element.querySelectorAll(".selected").forEach((elem) => {
            elem.classList.remove("selected");
        });

        // set the selection index to -1
        // 0 would be valid, so -1 means nothing is selected
        this.selectionIndex = -1;

        // get element selected by the cursor
        var selectedElement = document.getSelection().anchorNode.parentElement;

        // make sure there is an element selected
        if (selectedElement) {
            // add the selected class to the selected element
            selectedElement.classList.add("selected");

            // set the selection index to the offset of the cursor
            this.selectionIndex = document.getSelection().anchorOffset;

            console.log(selectedElement, this.selectionIndex);
        }
    }

    // This function is used to render the editor
    private render(location?: string): void {

        if (this.element) this.element.contentEditable = "false";

        // loop through the data and render it
        Object.keys(this._data).forEach((key) => {
            // create span using inbuilt functions, fill with text, add to this.renderedData
            var span = document.createElement("span");

            // Adding the id to the span as a dataset property so we can keep track
            span.dataset.key = key

            var elemInfo = this._data[key]
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

        // if we have a location, render into that
        if (location) {
            // generate element from the rendered data
            // render into provided location
            this.element = new MyElement({
                className: "editorMain",
                type: "div",
                attributes: {
                    contentEditable: "true",
                },
                content: Object.values(this.renderedData)[0] // the first element is the main element
            }).generateElement(location);
        } else if (this.element) { // if not, render into this.element if it exists
            // generate element from the rendered data
            // render into this.element
            console.log("we did this one")
            // set the innerHTML to the first element in the rendered data
            this.element.innerHTML = Object.values(this.renderedData)[0].outerHTML;
        } else { // if not, throw an error
            throw new Error("No location provided and no element to render into");
        }


        this.element.contentEditable = "true";
        // make sure there is a selection
        if (this.selectionIndex > -1) {
            // get the element with the selected class
            var selectedElement = this.element.querySelector(".selected") as HTMLElement;
            if (!selectedElement) { // this shouldn't really happen, but if it does, reset the selection
                this.selectionIndex = -1;
                return;
            }

            // we have to use a range to set the selection
            var range = document.createRange();

            // get selection
            var sel = window.getSelection();

            // setting the start of the index to the selection index
            // using the first child (the text content)
            range.setStart(selectedElement.childNodes[0], this.selectionIndex);

            this.element.querySelectorAll(".selected").forEach((elem) => {
                elem.classList.remove("selected");
            });

            range.collapse(true); // collapse range to start
            sel.removeAllRanges(); // remove any incorrect ranges/selections
            sel.addRange(range); // add our range to the selection

        }


    }

    // returns the data
    public get data(): EditorElements {
        return this._data;
    }


    private selectionIndex = -1;

    // This function is used to render the editor
    public generateElement(location: string): HTMLElement {

        this.render(location);

        // make a new variable for the timeout
        var timeout: ReturnType<typeof setTimeout>;

        // this is for handling new input
        this.element.onkeydown = (e) => {
            // if control B or I is pressed, return false (don't allow the browser to handle it)
            if ((e.ctrlKey || e.metaKey) && (e.key == "b" || e.key == "i")) {
                e.preventDefault();
                return false;
            }

            
            this.setupSelection();

            // log the time in HH:MM:SS
            console.log(new Date().toLocaleTimeString());

            // cancel timeout if it exists
            if (timeout) clearTimeout(timeout);

            // set timeout to 1 second
            timeout = setTimeout(() => {

                this.setupSelection();

                console.log(new Date().toLocaleTimeString() + " Timeout")
                this.recompose();
            }, 1000);
        }

        return this.element;
    }

    recompose() {
        // we are going to remake the data for the variable this.element using the innerHTML of this.element

        // get the element spans as a NodeListOf
        var spans = this.element.querySelectorAll("span.element") as NodeListOf<HTMLSpanElement>;

        // temporary data object which will be used to create the new data
        var newData: EditorElements = {};

        // this is where excess elements will be flagged
        var excessElements: string[] = [];

        // loop through the spans
        spans.forEach((span) => {

            // get the key
            var key = span.dataset.key;

            // get the innerHTML
            var text = span.innerHTML;

            // get the styling
            var styling = span.classList;

            // get any inner spans (not nested)
            var innerSpans = span.querySelectorAll(":scope > span") as NodeListOf<HTMLSpanElement>

            // if there are any inner spans, replace the innerHTML with the placeholder
            if (innerSpans.length) innerSpans.forEach((innerSpan) => {
                // replace the innerHTML with the placeholder
                text = text.replace(innerSpan.outerHTML, `{${innerSpan.dataset.key}}`);
            });

            // replace any &nbsp; with a space
            text = text.replace(/&nbsp;/g, " ");

            // new variable for the styling array, this will be used to create the new data
            var stylingArray: string[] = [];

            // loop through the styling and only add the ones that are in the EditorElementStyling type
            styling.forEach((style) => {
                // if style matches ALL_STYLINGS
                if (ALL_STYLINGS.includes(style as any)) {
                    stylingArray.push(style);
                }

                // handle colouring separately
                if (span.style.color) stylingArray.push("colour-" + span.style.color);
            });

            console.log(stylingArray);

            // check if the text contains any placeholders
            if (innerSpans.length === 1) {
                // check if text only contains a placeholder by replacing the brackets and checking if it's a key
                var potentialKey = text.replace("{", "").replace("}", "").trim();

                // if so, add the key of THIS element to the excessElements array
                // we'll deal with the other element later
                if (Object.keys(this._data).includes(potentialKey)) excessElements.push(key);
            }

            // add the text to the data at the key
            newData[key] = {
                text: text,
                styling: (stylingArray)
            }
        });

        // if (!element) { 
        //     delete newData[key]; 
        //     return; 
        // };

        console.log(JSON.parse(JSON.stringify(newData)))
        // check if there are any excess elements
        if (excessElements.length) {
            // loop through the excess elements
            excessElements.forEach((key) => {
                // get the element
                var element = newData[key];

                // if the element doesn't exist, return
                if (!element) return;

                // get the text 
                var text = element.text;

                // so we can get the key of the other element
                var mergeKey = text.replace("{", "").replace("}", "").trim();

                // get the other element
                var mergeElement = newData[mergeKey];

                // get the styling of the other element
                var mergeStyling = mergeElement.styling;

                // if mergeElement has normal and element has bold, remove bold from element
                if (mergeStyling.includes("normal") && element.styling.includes("bold")) {
                    element.styling.splice(element.styling.indexOf("bold"), 1);
                }

                // get the text of the element that is being merged
                var mergeText = mergeElement.text;

                // add the styling of the element that is being merged to the element
                element.styling = element.styling.concat(mergeStyling);

                // add the text of the element that is being merged to the element
                element.text = element.text.replace(`{${mergeKey}}`, mergeText);

                // delete the element that is being merged
                delete newData[mergeKey];

            });
        }

        // set the data to the new data
        this.data = (newData);
    }

    getSelection() {
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

        // this will return the final element
        return finalElement;
    }


    public constructor({

    }) {
        console.log("Editor initialised");
    }
}

export default Editor;