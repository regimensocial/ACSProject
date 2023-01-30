// This is the editor part of the application. It is used to edit the notes.

import Button from "./elementTypes/Button";
import MyElement from "./elementTypes/MyElement";
import { MyElementContent, randomID, State } from "./helpers";

// stylings (from SC 10.4)
const ALL_STYLINGS = [
    'bold',
    'italic',
    'subscript',
    'superscript',
    'underline',
    'un_bold',
    'selected',
    'selectedEnd'
] as const;
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

    // used later
    public noteID: string;

    // this is the element that the editor will be generated in
    private element: HTMLElement;

    // this is the parent element of the editor
    private editorParent: MyElement;

    // any controls the editor will have
    private editorControls: { [key: string]: MyElementContent } = {
        // the following are buttons in accordance with the SC 10.4
        bold: new Button({
            content: "Bold",
            className: "bold",
            func: () => {
                this.applyStyle("bold");
            }
        }),
        italic: new Button({
            content: "Italic",
            className: "italic",
            func: () => {
                this.applyStyle("italic");
            }
        }),
        underline: new Button({
            content: "Underline",
            className: "underline",
            func: () => {
                this.applyStyle("underline");
            }
        }),
        subscript: new Button({
            content: "Subscript",
            className: "subscript",
            func: () => {
                this.applyStyle("subscript");
            }
        }),
        superscript: new Button({
            content: "Superscript",
            className: "superscript",
            func: () => {
                this.applyStyle("superscript");
            }
        }),
        // we'll do colour and alignment later
    };

    public main(): void {
        console.log("Editor started");
    }

    // This implements the EditorElements interface
    // It is used to store the data for the editor
    private _data: EditorElements = {}

    // this will set our data and re-render the editor
    private set data(data: EditorElements) {
        // set the data
        this._data = data;
        // now render the editor
        this.render();
    }

    private renderedData: State = {};

    // this will be the current selection
    private currentSelection: HTMLElement;

    // this will set the current selection
    private setCurrentSelection(): void {
        // disable the buttons
        Object.values(this.editorControls).forEach((elem) => {
            (elem as Button).disabled = true;
        });

        // set the current selection
        this.currentSelection = this.getSelection() as HTMLElement;

        // enable the buttons
        Object.values(this.editorControls).forEach((elem) => {
            (elem as Button).disabled = false;
        });
    }


    // this is so I can repeat or move code
    private setupSelection(): void {
        // clear selection

        this.element.querySelectorAll(".selected").forEach((elem) => {
            elem.classList.remove("selected");
        });

        // set the selection index to -1
        // 0 would be valid, so -1 means nothing is selected
        this.selectionIndex[0] = -1;

        // get text node selected by the cursor
        var selectedNode = document.getSelection().anchorNode;

        // get end node
        var endNode = document.getSelection().focusNode;


        // changed to a guard clause
        // if there is no selected node, return
        if (!selectedNode) return;

        // get the range of the selection
        var range = window.getSelection().getRangeAt(0)

        // store offset before we replace the node
        this.selectionIndex[0] = range.startOffset;
        this.selectionIndex[1] = range.endOffset;


        // wrap selected node in a new span
        var selectedSpan = document.createElement("span");

        // add the selected class to the span, and the element class
        selectedSpan.classList.add("element", "selected");

        // add the key so it can be recomposed properly
        selectedSpan.dataset.key = "selection";

        // clone selectedNode (so we can remove it from the DOM)
        var selectedNodeClone = selectedNode.cloneNode(true);

        // add the clone to the span
        selectedSpan.appendChild(selectedNodeClone);

        // replace the selected node with the span
        selectedNode.parentNode.replaceChild(selectedSpan, selectedNode);

        // if the end node is different, we need to do the same thing
        if (endNode != selectedNode) {

            // wrap selected node in a new span
            var endSpan = document.createElement("span");

            // add the selected class to the span, and the element class
            endSpan.classList.add("element", "selectedEnd");

            // add the key so it can be recomposed properly
            endSpan.dataset.key = "selectionEnd";

            // clone selectedNode (so we can remove it from the DOM)
            var endNodeClone = endNode.cloneNode(true);

            // add the clone to the span
            endSpan.appendChild(endNodeClone);

            // replace the selected node with the span
            endNode.parentNode.replaceChild(endSpan, endNode);
        }

    }

    private setUpButtons(): void {
        // check where the cursor is, then set the buttons active according to styling of elements

        // make buttons inactive (remove active class)
        Object.keys(this.editorControls).forEach((key) => {
            (this.editorControls[key] as any).className = [key];
        });

        // get the stylings of the selection
        var stylings = this.getSelection(true) as string[];

        // check stylings contains any un_ styles and remove the respective styles
        var removals = stylings.filter((styling) => styling.startsWith("un_"));

        // remove the un_ from the removals
        removals = removals.map((removal) => removal.replace("un_", ""));

        // remove the removals from the stylings
        stylings = stylings.filter((styling) => !removals.includes(styling));

        stylings.forEach((styling) => {
            // if the styling is a colour, ignore it for now
            if (styling.startsWith("colour")) return;

            // otherwise, set the respective button active
            if (styling == "bold") {
                (this.editorControls.bold as any).className = ["bold", "active"];
            } else if (styling == "italic") {
                (this.editorControls.italic as any).className = ["italic", "active"];
            } else if (styling == "underline") {
                (this.editorControls.underline as any).className = ["underline", "active"];
            } else if (styling == "subscript") {
                (this.editorControls.subscript as any).className = ["subscript", "active"];
            } else if (styling == "superscript") {
                (this.editorControls.superscript as any).className = ["superscript", "active"];
            }
        });
    }

    // This function is used to render the editor
    private render(location: string = null, alternativeData?: EditorElements) {

        var dataToRender = alternativeData || this._data;

        if (this.element) this.element.contentEditable = "false";

        var renderedData: State = {};

        // loop through the data and render it
        Object.keys(dataToRender).forEach((key) => {
            // create span using inbuilt functions, fill with text, add to this.renderedData
            var span = document.createElement("span");

            // Adding the id to the span as a dataset property so we can keep track
            span.dataset.key = key

            var elemInfo = dataToRender[key]

            // add the text to the span
            span.innerHTML = elemInfo.text;
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

        if (alternativeData) return renderedData;

        this.renderedData = renderedData;

        // if we have a location, render into that
        if (location && !this.element) {
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

            // create a parent element
            // where other parts of the editor can be rendered
            this.editorParent = new MyElement({
                className: "editorParent",
                type: "div",
                content: [
                    new MyElement({ // the toolbar
                        className: "editorToolbar",
                        type: "div",
                        content: [
                            // for now, just show note title
                            this.noteID || "newNote",
                            // the wrapper for the buttons
                            new MyElement({
                                className: "editorToolbarButtons",
                                type: "div",
                                content: [ // the buttons
                                    this.editorControls.bold,
                                    this.editorControls.italic,
                                    this.editorControls.underline,
                                    this.editorControls.subscript,
                                    this.editorControls.superscript,
                                ]
                            })
                        ],
                        events: {
                            mouseover: () => {
                                this.setCurrentSelection();
                            }
                        }
                    }),
                    // editorMain is the main element
                    this.element
                ]
            })

            // generate the parent element
            this.editorParent.generateElement(location);

        } else if (this.element) { // if not, render into this.element if it exists
            // generate element from the rendered data
            // render into this.element
            // set the innerHTML to the first element in the rendered data
            this.element.innerHTML = Object.values(this.renderedData)[0].outerHTML;
        } else { // if not, throw an error
            throw new Error("No location provided and no element to render into");
        }


        this.element.contentEditable = "true";

        // make sure there is a selection
        if (this.selectionIndex[0] > -1) {
            // get the element with the selected class
            var selectedElement = this.element.querySelector(".selected") as HTMLElement;
            var selectedEndElement = this.element.querySelector(".selectedEnd") as HTMLElement;

            // if the end element is null, set it to the start element (the selection is only one element)
            if (!selectedEndElement) selectedEndElement = selectedElement;

            if (!selectedElement) { // this shouldn't really happen, but if it does, reset the selection
                this.selectionIndex[0] = -1;
                return;
            }

            // we have to use a range to set the selection
            var range = document.createRange();

            // get selection
            var sel = window.getSelection();

            // setting the start of the index to the selection index
            // using the first child (the text content)
            var firstChild = selectedElement.childNodes[0];
            var firstEndChild = selectedEndElement.childNodes[0];

            // if the first child is after the first end child, we need to swap them
            if (firstChild != firstEndChild && firstChild.compareDocumentPosition(firstEndChild) == 2) {
                // re order the elements so that the first child is the one that comes first
                var temp = firstChild;
                firstChild = firstEndChild;
                firstEndChild = temp;

                // flip selectedElement and selectedEndElement too 
                temp = selectedElement;
                selectedElement = selectedEndElement;

                // this part needed to be casted because it was complaining
                selectedEndElement = temp as HTMLElement;
            }

            // set the start of the range to the first child of the selected element
            range.setStart(firstChild, this.selectionIndex[0]);

            range.collapse(true); // collapse range to start
            sel.removeAllRanges(); // remove any incorrect ranges/selections
            sel.addRange(range); // add our range to the selection

            // extend the selection to the end of the selection
            sel.extend(firstEndChild, this.selectionIndex[1]);

            // get the parent of the selected element
            var parent = selectedElement.parentElement;
            var parentEnd = selectedEndElement.parentElement;

            // get the new range of the selection before we replace the element(s)
            var newRange = document.getSelection().getRangeAt(0);

            // get the new offset before we replace the element
            var newOffset = [newRange.startOffset, newRange.endOffset];

            // replace the selected element with the child
            parent.replaceChild(firstChild, selectedElement);

            // if the selected element is not the same as the selected end element, replace it too
            if (selectedEndElement != selectedElement) {
                // replace the selected element with the child
                parentEnd.replaceChild(firstEndChild, selectedEndElement);
            }

            // we're doing this again because the selection is lost when we replace the element
            // we have to use a range to set the selection
            range = document.createRange();

            // get selection
            sel = window.getSelection();

            // set selection start and end to the new offset
            range.setStart(firstChild, newOffset[0]);

            range.collapse(true); // collapse range to start
            sel.removeAllRanges(); // remove any incorrect ranges/selections
            sel.addRange(range);

            // extend the selection to the end
            sel.extend(firstEndChild, newOffset[1]);

        }

    }

    // returns the data
    public get data(): EditorElements {
        return this._data;
    }

    // now contains two values (start and end)
    private selectionIndex: [number, number] = [-1, -1];

    // this applies a style to the selected text
    private applyStyle(style: string, value?: string) {

        if (style == "newline") {
            // this inserts a newline into the text at the caret

            // get the selection
            var sel = window.getSelection();
            var range = sel.getRangeAt(0);
            range.collapse(true);

            // get the text node
            var textNode = range.startContainer;
            var text = textNode.textContent;
            var offset = range.startOffset;

            // split the text at the offset, and insert a newline 
            textNode.textContent = text.substring(0, offset) + "\n" + text.substring(offset);
            range.setStart(textNode, offset + 1);

            // set the selection to the new range
            range.setEnd(textNode, offset + 1);
            sel.removeAllRanges();
            sel.addRange(range);

        } else {
            // check style is valid
            if (ALL_STYLINGS.includes(style as any)) {

                // used for the "un" style
                var unstyle = "un_" + style;

                // this will be handled in "part two"
                if ((!this.currentSelection) || this.currentSelection.textContent.length == 0) return;

                // create a temporary document fragment
                var temp = document.createDocumentFragment();

                // append the current selection to the fragment
                temp.appendChild(this.currentSelection);

                // this is because parts of the selection can be lost during recomposition
                // so it's best just to wrap the whole thing in a fragment
                // that can then be sent off to be re-composed

                // get all the spans in our selection
                var spans = temp.querySelectorAll("span.element") as NodeListOf<HTMLSpanElement>;

                // generate a random ID for our selection
                // this is used for keys
                var newID = randomID(Object.keys(this._data));

                // loop through all the spans and randomly generate a new ID for them
                for (var i = 0; i < spans.length; i++) {
                    var span = spans[i];

                    // set the key to the new ID (or on the first span, the new ID)
                    span.dataset["key"] = (i === 0) ? newID : randomID(Object.keys(this._data));

                    // only on the first span, add the bold/unbold class
                    if (i === 0) {
                        // if it doesn't have the bold class, add it
                        if (!span.classList.contains(style)) {
                            span.classList.add(style);
                            span.classList.remove(unstyle);
                        } else {
                            // if it does have the bold class, remove it
                            span.classList.remove(style);
                            span.classList.add(unstyle);
                        }

                        // if parent is subscript or superscript, the opposite should be removed entirely
                        if (style == "subscript") {
                            span.classList.remove("superscript");
                            span.classList.remove("un_superscript");
                        } else if (style == "superscript") {
                            span.classList.remove("subscript");
                            span.classList.add("un_subscript");
                        }

                    } else { // on all others, remove the bold/unbold class
                        span.classList.remove(unstyle);
                        span.classList.remove(style);

                        if (style == "subscript" || style == "superscript") {
                            
                            // in all children, remove anything related to subscript or superscript
                            span.classList.remove("subscript");
                            span.classList.remove("un_subscript");
                            span.classList.remove("superscript");
                            span.classList.remove("un_superscript");
                        }
                    }

                    // if it's a subscript or superscript, remove the other one
                    

                }

                // get the recomposed selection
                var recomposedSelection = this.recompose(temp as any);

                // delete selection 
                document.getSelection().deleteFromDocument();



                // insert random ID placeholder using our new ID
                // document.getSelection().getRangeAt(0).insertNode(document.createTextNode(`{${newID}}`));

                // do the above, but check if it's an empty span, if so, delete the span
                var range2 = document.getSelection().getRangeAt(0);
                
                // we want to insert text, but if the text is in an empty span, we want to delete the span
                // so we check if the parent is a span, and if it is, we check if it's empty
                if (range2.startContainer.parentElement.tagName == "SPAN" && range2.startContainer.parentElement.textContent.length == 0) {
                    // if it is, we delete the span
                    
                    // loop through all parents and delete them if they're empty
                    var parent = range2.startContainer.parentElement;
                    while (parent.parentElement.tagName == "SPAN" && parent.parentElement.textContent.length == 0) {
                        parent = parent.parentElement;
                    }

                    parent.outerHTML = `{${newID}}`;
                } else {
                    // if it isn't, we insert the text
                    range2.insertNode(document.createTextNode(`{${newID}}`));
                }


                // do a special recomposition which doesn't re-render the editor
                // this gives us the data, minus the selection
                var partialRecomposition = this.recompose(null, true)

                // add our new data to the data
                // this will force a re-render due to my setter
                this.data = { ...partialRecomposition, ...recomposedSelection };

                // select element with key newID
                var element = document.querySelector(`[data-key="${newID}"]`);

                // this part reselects the element
                const range = document.createRange();
                range.selectNode(element);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    }

    // This function is used to render the editor
    public generateElement(location: string): HTMLElement {

        this.render(location);

        // make a new variable for the timeout
        var timeout: ReturnType<typeof setTimeout>;

        // this is for handling new input
        this.element.onkeydown = (e) => {
            // if control B or I is pressed, return false (don't allow the browser to handle it)
            if (
                (e.ctrlKey || e.metaKey) && (e.key == "b" || e.key == "i")
            ) {
                e.preventDefault();
                return false;
            }

            // if enter is pressed, return false (don't allow the browser to handle it)
            if (e.key == "Enter") {
                e.preventDefault();
                this.applyStyle("newline");
            }

            this.setUpButtons();

            // cancel timeout if it exists
            if (timeout) clearTimeout(timeout);

            // set timeout to 1 second
            timeout = setTimeout(() => {
                this.recompose();
            }, 1000);
        }

        return this.element;
    }

    // recompose the data into our format
    // by default, recompose the data in this.element
    private recompose(alternativeElement: HTMLElement = null, ignoreSelection: boolean = false) {

        // get the element to recompose
        var recomposingElement = alternativeElement || this.element;

        // set up selection on recomposition (on normal recomposition)
        if (!alternativeElement && !ignoreSelection) this.setupSelection();

        // we are going to remake the data for the variable this.element using the innerHTML of this.element

        console.log(recomposingElement)
        // get the element spans as a NodeListOf
        var spans = recomposingElement.querySelectorAll("span.element") as NodeListOf<HTMLSpanElement>;

        // if spans are empty, set it to a node list with the element itself
        if (!spans.length || alternativeElement) {
            var temp = document.createDocumentFragment();
            temp.appendChild(recomposingElement);
            spans = temp.querySelectorAll("span.element") as NodeListOf<HTMLSpanElement>;
        }

        // var spansAsFragment = document.createDocumentFragment();
        // spans.forEach((span) => {
        //     spansAsFragment.appendChild(span);
        // });
        // console.log(spansAsFragment)

        // temporary data object which will be used to create the new data
        var newData: EditorElements = {};

        // this is where excess elements will be flagged
        var excessElements: string[] = [];

        // loop through the spans
        Array.from(spans).map((span, index) => {

            // get the key
            var key = span.dataset.key;

            // get the innerHTML
            var text = span.innerHTML;

            if (!text) {
                // delete the key from the data
                delete this._data[key];
            }

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

            // check if the text contains any placeholders
            if (innerSpans.length === 1) {
                // check if text only contains a placeholder by replacing the brackets and checking if it's a key
                var potentialKey = text.replace("{", "").replace("}", "").trim();

                // if any of the keys are due to selection, ignore them
                if (!(potentialKey == "selection" || potentialKey == "selectionEnd" || (key == "selection") || (key == "selectionEnd"))) {
                    // if so, add the key of THIS element to the excessElements array
                    // we'll deal with the other element later
                    if (Object.keys(this._data).includes(potentialKey)) excessElements.push(key);
                }


            }

            // if there are no styling and it's not the first element, add it to excess elements
            if (!stylingArray.length && index !== 0) excessElements.push(key);

            // add the text to the data at the key
            newData[key] = {
                text: text,
                styling: (stylingArray)
            }
        });

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

                if (!mergeElement) {
                    // if the other element doesn't exist, delete this element
                    // delete newData[key];
                    return;
                } 

                // get the styling of the other element
                var mergeStyling = mergeElement.styling;

                // if mergeElement has unbold and element has bold, remove bold from element
                if (mergeStyling.includes("un_bold") && element.styling.includes("bold")) {
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

        // if no alternative element is provided, set the data to the new data
        // and render the new data
        if (!alternativeElement) {
            // this calls render
            this.data = newData;
        }

        // return the new data
        return newData;


    }

    getSelection(stylingsOnly = false) {
        // get the selected text
        var selection = window.getSelection();

        // if there is no selection, return null
        // or if the selection is not in the editor, return null
        if (!selection || selection.rangeCount === 0 || !this.element.contains(selection.anchorNode)) return null;

        // this is the range of the selection
        var range = selection.getRangeAt(0);

        // this is a clone of the contents, so we can observe it
        var clone = range.cloneContents();

        // this will store the styling of the selection
        var stylings = [];

        // loop through the children of the clone
        for (var i = 0; i < clone.children.length; i++) {
            // get the child
            var child = (clone.children[i] as HTMLElement);

            // if it's a text node, return
            if (child.nodeType === Node.TEXT_NODE) return;

            // loop through the classlist 


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
                // add the class to the stylings array if it's in the ALL_STYLINGS arrayy
                if (ALL_STYLINGS.includes(className as any)) stylings.push(className);
            });

            // for now, colour is the only style that needs to be copied
            (newParent).style.color = (firstParent as HTMLElement).style.color;

            // if we have a colour, add it to the stylings array
            if ((firstParent as HTMLElement).style.color) stylings.push("colour-" + (firstParent as HTMLElement).style.color);

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

        // if we only want the stylings, return them, otherwise return the final element
        return stylingsOnly ? stylings : finalElement;
    }

    // our constructor, which takes in some parameters 
    public constructor(data: {
        noteID?: string,
        data?: EditorElements,
        // hideControls?: boolean,
    }) {
        // set the data (if none, use our placeholder data)
        this._data = (data.data || {
            "1": {
                text: "The quick {2} the lazy dog.",
            },
            "2": {
                text: "brown {3} jumps over",
                // adding style to the data
                
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
                    "italic"
                ]
            }
        });

        // set the noteID
        this.noteID = (data.noteID || "unknown");

        console.log("Editor initialised");
    }
}

export default Editor;