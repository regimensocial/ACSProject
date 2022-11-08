// This is the editor part of the application. It is used to edit the notes.

import MyElement from "./elementTypes/MyElement";
import { State, StringDict } from "./helpers";



class Editor {

    public noteID: String;
    private element: HTMLElement;

    public main(): void {
        console.log("Editor started");
    }

    private data: State = {
        "1": {
            text: "Hello {2}",
        },
        "2": {
            text: "test 2",
        },
    }

    public generateElement(location: string): HTMLElement {

        var renderedData: State = {};

        Object.keys(this.data).forEach((key) => {
            // create span, fill with text, add to renderedData, Don't use MyElement, use inbuilt functions;
            var span = document.createElement("span");
            span.innerText = this.data[key].text;
            renderedData[key] = span;
        });

        console.log(renderedData);

        Object.keys(renderedData).forEach((key) => {
            // replace all {id} with renderedData[id]

            var text = renderedData[key].innerHTML;
            console.log(text)
                
            Object.keys(renderedData).forEach((key) => {
                if (text.includes("{" + key + "}")) {
                    text = text.replace("{" + key + "}", renderedData[key].outerHTML);
                }
            });

            renderedData[key].innerHTML = text;

        });

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