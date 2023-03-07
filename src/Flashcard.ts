import { randomID } from "./helpers";

class Flashcard {
    // The ID of the flashcard
    private _id = "";

    // The getter for the ID
    get id(): string {
        return this._id;
    }

    // The front of the flashcard
    public front = "";
    // The back of the flashcard
    public back = "";
    // The tags for the flashcard
    public tags: string[] = [];
    
    // Type of flashcard can only be "basic", "basicReverse" or "basicTyped"
    private _type: "basic" | "basicReverse" | "basicTyped" = "basic";
    
    // Getter for type
    get type() {
        return this._type;
    }

    // This is the data the SM-2 algorithm uses
    private _cardData = {
        n: 0,
        ef: 2.5,
        i: 0
    }

    // Getter for cardData
    get cardData() {
        return this._cardData;
    }

    // Due date for the card
    private _dueDate = new Date();

    // Setter for cardData, for use in the SM-2 algorithm
    // It also works out the due date for the card
    set cardData(data: { n: number, ef: number, i: number }) {
        this._cardData = data;

        // set dueDate to today + i
        this._dueDate = new Date();
        this._dueDate.setDate(this._dueDate.getDate() + this._cardData.i);
    }

    // Getter for dueDate
    get dueDate() {
        return this._dueDate;
    }

    public setFromLocalStorage(data: any) {
        // Set the values
        this.front = data.front;
        this.back = data.back;
        this.tags = data.tags;
        this._type = data._type;
        this._id = data._id;
        this._cardData = data._cardData;
        this._dueDate = new Date(data._dueDate);

        // Only run once
        this.setFromLocalStorage = () => {
            throw new Error("setFromLocalStorage can only be run once");
        };
    }

    constructor(front: string, back: string, tags: string[], type: "basic" | "basicReverse" | "basicTyped") {
        // Set the values
        this.front = front;
        this.back = back;
        this.tags = tags;
        this._type = type;

        // Set ID to something random
        this._id = randomID();

    }
}

export default Flashcard;