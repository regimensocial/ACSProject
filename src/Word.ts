class Word {
    // The actual word is stored here
    private _word = "";
    get word(): string {
        return this._word;
    }

    // Alt code for the word, used for typing the word when ALT + altCode is pressed.
    private _altCode = "";
    get altCode(): string {
        return this._altCode;
    }

    // Shorthand for the word, used for replacing with the real word.
    private _shortHand = "";
    get shortHand(): string {
        return this._shortHand;
    }

    // Constructor
    constructor(word: string, altCode: string, shortHand: string) {
        this._word = word;
        this._altCode = altCode;
        this._shortHand = shortHand;
    }
}

export default Word;