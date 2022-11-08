import Editor from "../editor";
import Button from "../elementTypes/Button";
import MyElement from "../elementTypes/MyElement";
import { State } from "../helpers";

// export the function returning array of MyElements
export default (props: State) => {

    var showNoteMenu = false;
    // menu with input title, create, cancel

    var noteMenuTitle = new MyElement({
        className: "input",
        type: "input",
        content: "",
        attributes: {
            placeholder: "Title"
        }
    });

    var newNoteMenu = new MyElement({
        className: "newNoteMenu",
        type: "div",
        content: [
            new MyElement({
                className: "subtitle",
                type: "span",
                content: "New Note",
            }),
            noteMenuTitle,
            new Button({
                className: "button",
                content: "Create",
                func: () => {
                    // hide all menus
                    if (!(noteMenuTitle.element as HTMLInputElement).value) return;
                    props.hideMenus();

                    var editor = new Editor({
                        noteID: (noteMenuTitle.element as HTMLInputElement).value,
                    }).generateElement(".editor");

                }
            }),
            new Button({
                className: "button",
                content: "Cancel",
            }),
        ],
        styling: {
            visibility: showNoteMenu ? "visible" : "hidden"
        }
    });

    // separated from main variable so that they can be updated selectively 
    var buttons = {
        create: new Button({
            className: "button",
            content: "Create",
            func: () => {
                showNoteMenu = !showNoteMenu;
                // update create button to show cancel button
                buttons.create.content = showNoteMenu ? "Cancel" : "Create";
                newNoteMenu.styling = {
                    // show or hide the menu depending on the value of showNoteMenu
                    visibility: showNoteMenu ? "visible" : "hidden"
                };
                // disable delete button while making note
                buttons.delete.disabled = showNoteMenu;
            }
        }),
        // new button for deleting flashcards
        delete: new Button({
            className: "button",
            content: "Delete",
        }),
        
    }

    return [
        new MyElement({
            className: "title",
            type: "div",
            content: "Notes",
        }),

        // container for the buttons
        new MyElement({
            className: "buttons",
            type: "div",
            content: [// new button for the notetaking side
                // back button
                new Button({
                    className: "button",
                    content: "Back",
                    func: () => {
                        props.changeMenu("main");
                    }
                }),
                buttons.create,
                buttons.delete,
            ]
        }),

        newNoteMenu,

        // list of notes
        new MyElement({
            className: "notes",
            type: "p",
            content: "Notes will go here",
        })
    ]
}