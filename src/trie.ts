const config = {
    END_WORD: "$",
    PERMS_MIN_LEN: 2,
};

export class Trie {
    /**
     *
     *
     * @internal
     * @type {*}
     * @memberOf Trie
     */
    private _trie: any;

    constructor(input?: string[]) {
        this._trie = Trie._create(input);
    }

    public getIndex() {
        return this._trie;
    }

    public setIndex(trie: any) {
        this._trie = trie;
    }

    public addWord(word: string) {
        const reducer = (
            previousValue: any,
            currentValue: string,
            currentIndex: number,
            array: string[]
        ) => {
            return Trie._append(
                previousValue,
                currentValue,
                currentIndex,
                array
            );
        };

        const input: string[] = word /*.toLowerCase()*/
            .split("");
        input.reduce(reducer, this._trie);
        return this;
    }

    public removeWord(word: string) {
        const { prefixFound, prefixNode } = Trie._checkPrefix(this._trie, word);

        if (prefixFound) {
            delete prefixNode[config.END_WORD];
        }

        return this;
    }

    public getWords() {
        return Trie._recursePrefix(this._trie, "");
    }

    public getPrefix(strPrefix: string) {
        // strPrefix = strPrefix.toLowerCase();
        if (!this._isPrefix(strPrefix)) {
            return [];
        }

        const { prefixNode } = Trie._checkPrefix(this._trie, strPrefix);

        return Trie._recursePrefix(prefixNode, strPrefix);
    }

    /**
     *
     *
     * @internal
     * @param {any} prefix
     * @returns
     *
     * @memberOf Trie
     */
    private _isPrefix(prefix: any) {
        const { prefixFound } = Trie._checkPrefix(this._trie, prefix);

        return prefixFound;
    }

    /**
     *
     *
     * @internal
     * @static
     * @param {any} trie
     * @param {any} letter
     * @param {any} index
     * @param {any} array
     * @returns
     *
     * @memberOf Trie
     */
    private static _append(trie: any, letter: any, index: any, array: any) {
        trie[letter] = trie[letter] || {};
        trie = trie[letter];

        if (index === array.length - 1) {
            trie[config.END_WORD] = 1;
        }

        return trie;
    }

    /**
     *
     *
     * @internal
     * @static
     * @param {any} prefixNode
     * @param {string} prefix
     * @returns
     *
     * @memberOf Trie
     */
    private static _checkPrefix(prefixNode: any, prefix: string) {
        const input: string[] = prefix /*.toLowerCase()*/
            .split("");
        const prefixFound = input.every((letter, index) => {
            if (!prefixNode[letter]) {
                return false;
            }
            return (prefixNode = prefixNode[letter]);
        });

        return {
            prefixFound,
            prefixNode,
        };
    }

    /**
     *
     *
     * @internal
     * @static
     * @param {any} input
     * @returns
     *
     * @memberOf Trie
     */
    private static _create(input: any) {
        const trie = (input || []).reduce((accumulator: any, item: any) => {
            item
                /*.toLowerCase()*/
                .split("")
                .reduce(Trie._append, accumulator);

            return accumulator;
        }, {});

        return trie;
    }

    /**
     *
     *
     * @internal
     * @static
     * @param {any} node
     * @param {any} prefix
     * @param {string[]} [prefixes=[]]
     * @returns
     *
     * @memberOf Trie
     */
    private static _recursePrefix(
        node: any,
        prefix: any,
        prefixes: string[] = []
    ) {
        let word = prefix;

        for (const branch in node) {
            if (branch === config.END_WORD) {
                prefixes.push(word);
                word = "";
            }
            Trie._recursePrefix(node[branch], prefix + branch, prefixes);
        }

        return prefixes.sort();
    }
}
