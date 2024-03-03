import TraceNode from "./TraceNode";

/**
 * Class that contains an array of {@link TraceNode}s and manages them. It gives access to several functions that
 * help you to extract information needed for the editor.
 */
class JsonManager {
    /**
     * Constructor takes in a json-string, maps the data to {@link TraceNode}s and saves them in an array.
     * @param jsonString jsonString that contains the initial data from the backend.
     */
    constructor(jsonString) {
        this.nodes = [];
        let jsonData = JSON.parse(jsonString);
            jsonData.forEach((jsonData) => {
                this.nodes.push(new TraceNode(jsonData));
            });
            for(let i = 2; i < this.nodes.length; i++){
                let node = this.nodes[i];
                if(node.nodeType === "Throw")
                    node.outLinkPosition = this.nodes[node.outIndex].ranges[0].getStartPosition();
                if(node.nodeType === "Function") {
                    node.linkPosition = node.outLinks[node.outLinks.length - 1].range.getStartPosition();
                    node.outLinkPosition = node.link.range.getStartPosition();
                }

                if(node.nodeType === "Function" || node.nodeType === "Throw") {
                    let parentIndex = node.parentIndex;
                    while(this.nodes[parentIndex].nodeType !== "Function") {
                        if(this.nodes[parentIndex].nodeType === "Loop") {
                            node.outLoopIterations.unshift[this.nodes[parentIndex].iteration];
                            if(this.nodes[parentIndex].iteration !== 1)
                                parentIndex = this.nodes[parentIndex].parentIndex;
                        }
                        parentIndex = this.nodes[parentIndex].parentIndex
                    }
                    this.nodes[i].outFunctionIndex = parentIndex;
                }
            }
    }

    /**
     * Returns the index of the main function in nodes.
     * @returns {number}
     */
    getMain(){
        return 1;
    }

    /* For future loop tracking implementation:
    updateActiveLoopsFunction(selectedFunction, selectedIterations){
        //if [] assume all iteration are zero
    }*/

    /**
     * Determines all function and throw nodes contained in the currently selected function and calculates whether they
     * are currently active or not by looking at the selected iterations.
     * @param functionIndex Index of the currently active function
     * @param selectedIterations selected loop iterations (TODO)
     * @returns {*[]} An array with all the indices of the Function or Throw nodes
     * contained in the currently selected function.
     */
    updateJumpsFunction(functionIndex, selectedIterations){
        let jumps = [];
        jumps.push(functionIndex);
        if(selectedIterations.length === 0) {
            this.nodes[functionIndex].childrenIndices.forEach((childIndex) => {
                jumps = jumps.concat(this.getJumps(childIndex));
            });
        }
        return jumps;
     }

    /**
     * Recursively determines all function and throw nodes that are part of the function
     * of the current node and have the current node as a grandparent.
     * @param nodeIndex node index of current node.
     * @returns {*[]} An array with all function and throw nodes that are part of the function of the current node.
     */
    getJumps(nodeIndex) {
        let jumps = [];
        if(this.nodes[nodeIndex].nodeType === "Function" || this.nodes[nodeIndex].nodeType === "Throw")
            jumps.push(nodeIndex);
        this.nodes[nodeIndex].childrenIndices.forEach((childIndex) => {
            jumps = jumps.concat(this.getJumps(childIndex));
        });
        return jumps;
    }

    /**
     * Determines all ranges in the currently selected function and calculates whether they
     * are currently active or not by looking at the selected iterations.
     * @param functionIndex Index of the currently active function
     * @param selectedIterations selected loop iterations (TODO)
     * @returns {*[]} An array with all the active ranges contained in the currently selected function.
     */
    updateActiveRangesFunction(functionIndex, selectedIterations) {
        if(selectedIterations.length === 0) {
            let ranges = [];
            this.nodes[functionIndex].ranges.forEach((range) => {
                ranges.push(range);
            });
            this.nodes[functionIndex].childrenIndices.forEach((childIndex) => {
                ranges = ranges.concat(this.getRanges(childIndex));
            });
            return ranges;
        }
    }

    /**
     * Recursively determines all ranges of all child nodes that are part of the function
     * of the current node.
     * @param nodeIndex node index of current node.
     * @returns {*[]} An array with all ranges of the current node and all child nodes that are part of the function.
     */
    getRanges(nodeIndex) {
        let ranges = [];
        if(this.nodes[nodeIndex].nodeType === "Function") {
            ranges.push(this.nodes[nodeIndex].link.range);
        } else if(!(this.nodes[nodeIndex].nodeType === "Loop") || this.nodes[nodeIndex].iteration === 1) {
            this.nodes[nodeIndex].ranges.forEach((range) => {
                ranges.push(range);
            });
            this.nodes[nodeIndex].childrenIndices.forEach((childIndex) => {
                ranges = ranges.concat(this.getRanges(childIndex));
            });
        }
        return ranges;
    }
}
export default JsonManager;