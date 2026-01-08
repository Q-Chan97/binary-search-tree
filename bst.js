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

    insert(value) {
        function helper(node) {
            if (node === null) return new Node(value); // Creates new node when empty spot is found

            if (node.data > value) node.leftChild = helper(node.leftChild); // Moves left

            if (node.data < value) node.rightChild = helper(node.rightChild); // Moves right

            return node; // Rebuilds tree on way back up
        }
        this.root = helper(this.root); 
    }

    delete(value) {
        const helper = (node, value) => {
            if (node === null) return null; // Base, deletes node

            if (node.data > value) node.leftChild = helper(node.leftChild, value); // Moves left

            // Moves right, else if so that the else statement doesn't belong to it
            else if (node.data < value) node.rightChild = helper(node.rightChild, value); 

            else { 
                // Value found; 0 or 1 child case. Returned child replaces deleted node
                if (node.leftChild === null) return node.rightChild;
                if (node.rightChild === null) return node.leftChild;

                // Case for two children
                let successor = this.findSuccessor(node.rightChild);
                node.data = successor.data; // Overwrites old data with new data
                node.rightChild = helper(node.rightChild, successor.data); // Links new right child, building tree and removing duplicate successor
            }

            return node; // Rebuilds tree on way back up
        }
        this.root = helper(this.root, value);
    }

    // Recursive function, finds in-order successor
    findSuccessor(node) {
        if (node.leftChild === null) return node;
        return this.findSuccessor(node.leftChild);
    }

    find(value) {
        const helper = (node) => {
            if (node === null) return null; // Return node or null if the value is found or not
            if (node.data === value) return node;

            if (value < node.data) return helper(node.leftChild); // Moves through tree
            else return helper(node.rightChild);
        }
        return helper(this.root); // Start at root
    }

    height(node) { // Counts height of node to deepest leaf node
        if (node === null) return -1; // Return -1 if not found

        return 1 + Math.max( // Returns highest number found in both subtrees
            this.height(node.leftChild),
            this.height(node.rightChild)
        )
    }

    depth(node) {
        const helper = (node, value, edges) => {
            if (node === null) return -1; // Value not found
            if (node.data === value) return edges; // Returns edges when value found

            if (value < node.data) return helper(node.leftChild, value, edges + 1); // Edges go up each recursion call
            else return helper(node.rightChild, value, edges + 1);
        }
        return helper(this.root, node.data, 0); // Edges start at 0
    }

    levelOrderForEach(callback) { // Iterative version
        if (callback === undefined) throw Error("Callback required");
        if (this.root === null) return;

        const queue = [];
        queue.push(this.root); // Start with root node

        while (queue.length !== 0) {
            let node = queue.shift(); // Captures node
            callback(node); // Do something with node
            if (node.leftChild !== null) queue.push(node.leftChild); // Adds children to queue and continues to next node
            if (node.rightChild !== null) queue.push(node.rightChild);
        }
    }

    levelOrderForEachRecur(callback) { // Recursive version
        if (this.root === null) return;

        let height = this.height(this.root); // Gets height of root (number of levels)

        const levelVisit = (node, level) => {
            if (node === null) return;

            if (level === 0) { // At root of tree, use callback function on node
                callback(node);
            } else {
                levelVisit(node.leftChild, level - 1); // Move to children down tree vertically
                levelVisit(node.rightChild, level - 1);
            }
        }
        for (let i = 0; i < height; i++) { // Moves through each level horizontally
            levelVisit(this.root, i);
        }
    }
}

const prettyPrint = (node, prefix = '', isLeft = true) => {
    if (node === null) {
      return;
    }
    if (node.rightChild !== null) {
      prettyPrint(node.rightChild, `${prefix}${isLeft ? '│   ' : '    '}`, false);
    }
    console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
    if (node.leftChild !== null) {
      prettyPrint(node.leftChild, `${prefix}${isLeft ? '    ' : '│   '}`, true);
    }
};

let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9]
let tree = new Tree(arr);

let testNode = tree.find(6); // Capture 6
console.log(tree.depth(testNode)); // Should return 3- 6 is three levels down
console.log(prettyPrint(tree.root));