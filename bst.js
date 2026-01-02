class Node {
    constructor(data, leftChild = null, rightChild = null) {
        this.data = data;
        this.leftChild = leftChild;
        this.rightChild = rightChild;
    }
}

class Tree {
    constructor(array) {
        // Set removes duplicates, spread operator converts Set to array, sort() reorders values in ascending order
        // End result is a sorted array with no duplicates
        const sortedArray = [...new Set(array)].sort((a, b) => a - b);
        this.root = this.buildTree(sortedArray);
    }

    buildTree(array) {
        if (array.length === 0) return null;

        const mid = Math.floor(array.length / 2); // Divides array in half
        const root = new Node(array[mid]); // Captures best middle node

        root.leftChild = this.buildTree(array.slice(0 , mid)); // Halves further recursively, until array reaches 0
        root.rightChild = this.buildTree(array.slice(mid + 1)) // Gets everything after mid node

        return root; // Bubbles up so that each node has a left and right child node
    }
}