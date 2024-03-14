import TraceNode from "./TraceNode";
import {Position} from "monaco-editor";

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
        this.activeIterations = [];
        this.skipIds = [];
        this.activeIterationIndex = 0;

        let jsonData = JSON.parse(jsonString);
            jsonData.forEach((jsonData) => {
                this.nodes.push(new TraceNode(jsonData));

            });
            for(let i = 2; i < this.nodes.length; i++){
                let node = this.nodes[i];
                if(node.nodeType === "Throw") {
                    node.outLinkPosition = new Position(0,0);
                    if(undefined !== this.nodes[node.outIndex].ranges[0]) //if catch is empty and has no range
                        node.outLinkPosition = this.nodes[node.outIndex].ranges[0].getStartPosition();
                }
                if(node.nodeType === "Function") {
                    node.linkPosition = node.outLinks[node.outLinks.length - 1].range.getStartPosition();
                    node.outLinkPosition = node.link.range.getStartPosition();
                }
                if(node.nodeType === "Function" || node.nodeType === "Throw") {
                    let currentIndex = node.outIndex;
                    let currentNode = this.nodes[currentIndex];

                    let parentBeforeIndex = 0;
                    let iterationsBefore = 0;
                    let iterations = [];
                    let start = true;
                    while(currentNode.nodeType !== "Function" || start) {
                        if(!start) {
                            currentIndex = this.nodes[currentIndex].parentIndex;
                            currentNode = this.nodes[currentIndex];
                        }
                        iterations = [];
                        if (currentNode.nodeType === "Loop") {
                            iterations.push(currentIndex);
                        }
                        currentNode.childrenIndices.forEach((childIndex) => {
                            if (childIndex === parentBeforeIndex) {
                                iterations.push(...iterationsBefore);
                            } else if (this.nodes[childIndex].iteration === 1 && this.nodes[childIndex].traceId !== this.nodes[parentBeforeIndex].traceId) {
                                iterations.push(childIndex);
                            }
                        });
                        parentBeforeIndex = currentIndex;
                        iterationsBefore = iterations;
                        start = false;
                    }
                    this.nodes[i].outLoopIterations = iterations;
                    this.nodes[i].outFunctionIndex = currentIndex;
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

    /**
     * Returns the number of the last iteration that belongs to the loop.
     * @param iterationIndex index of a {@link TraceNode} with any iteration belonging to the loop to be analysed.
     * @returns {*|null} number of last iteration.
     */
    getLastIterationNumber(iterationIndex){
        let iterationIndexId = this.nodes[iterationIndex].traceId;
        let lastIteration = this.nodes[iterationIndex].iteration;

        this.nodes[this.nodes[iterationIndex].parentIndex].childrenIndices.forEach((childIndex) => {
            if(this.nodes[childIndex].traceId === iterationIndexId && this.nodes[childIndex].iteration > lastIteration)
                lastIteration = this.nodes[childIndex].iteration;
        });
        return lastIteration;
    }

    /**
     * Determines how many loops are active in the current function,
     * assuming that all occurring loops have iteration set to one.
     * @param functionIndex Index of the currently active function.
     * @param activeIterationIndices Iterations that are currently selected(beginning function -> end function).
     * @returns {*[]} Array with all the initially active iterations(filled with 1s) of this function.
     * Length equals how many loops are active.
     */
    initIterations(functionIndex, activeIterationIndices){
        this.skipIds = [];
        this.activeIterations = [...activeIterationIndices];
        this.activeIterationIndex = 0;
        this.nodes[functionIndex].childrenIndices.forEach((childIndex) => {
            this.getIterations(childIndex);
        });
        return this.activeIterations;
    }

    /**
     * Recursively determines all active loops that have this node as a grandparent,
     * assuming that all occurring loops have iteration set to one.
     * @param nodeIndex node index of current node.
     * @returns {[*]} Array with all the initially active iterations(filled with 1s).
     * That have the current node as a grandparent and are part of this nodes function.
     */
    getIterations(nodeIndex){
        let end = false;
        this.skipIds.forEach((skipId) => {
            if(this.nodes[nodeIndex].traceId === skipId) {
                end = true;
            }
        });
        if(!end) {
            let skip = true;
            if (this.nodes[nodeIndex].nodeType !== "Function" && this.nodes[nodeIndex].nodeType !== "Loop")
                skip = false;
            if (this.activeIterationIndex + 1 > this.activeIterations.length && this.nodes[nodeIndex].iteration === 1) {
                this.activeIterations.push(nodeIndex);
                this.activeIterationIndex++;
                skip = false;
                this.skipIds.push(this.nodes[nodeIndex].traceId);            }
            if (!(this.activeIterationIndex + 1 > this.activeIterations.length) && this.nodes[nodeIndex].iteration === this.nodes[this.activeIterations[this.activeIterationIndex]].iteration) {
                this.activeIterationIndex++;
                this.skipIds.push(this.nodes[nodeIndex].traceId);
                skip = false;
            }
            if (!skip) {
                this.nodes[nodeIndex].childrenIndices.forEach((childIndex) => {
                    this.activeIterations.concat(this.getIterations(childIndex));
                });
            }
        }
    };

    /**
     * Determines all function and throw nodes contained in the currently active function and calculates whether they
     * are currently active or not by looking at the active iterations.
     * @param functionIndex Index of the currently active function.
     * @param activeIterationIndices active loop iterations.
     * @returns {*[]} An array with all the indices of the Function or Throw nodes
     * contained in the currently active function.
     */
    updateJumpsFunction(functionIndex, activeIterationIndices){
        this.skipIds = [];
        this.activeIterations = [...activeIterationIndices];
        let jumps = [];
        jumps.push(functionIndex);
        this.nodes[functionIndex].childrenIndices.forEach((childIndex) => {
            jumps = jumps.concat(this.getJumps(childIndex));
        });
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
        let end = false;
        this.skipIds.forEach((skipId) => {
            if(this.nodes[nodeIndex].traceId === skipId)
                end = true;
        });
        if(end)
            return jumps;
        if(this.nodes[nodeIndex].nodeType === "Function" || this.nodes[nodeIndex].nodeType === "Throw")
            jumps.push(nodeIndex);
        if((!(this.nodes[nodeIndex].nodeType === "Loop") ||
                nodeIndex === this.activeIterations[0])) {
            if(this.nodes[nodeIndex].nodeType === "Loop") {
                this.activeIterations.shift();
                this.skipIds.push(this.nodes[nodeIndex].traceId);
            }
            if(this.nodes[nodeIndex].nodeType !== "Function") {
                this.nodes[nodeIndex].childrenIndices.forEach((childIndex) => {
                    jumps = jumps.concat(this.getJumps(childIndex));
                });
            }
        }
        return jumps;
    }

    /**
     * Determines all ranges in the currently active function and calculates whether they
     * are currently active or not by looking at the active iterations.
     * @param functionIndex Index of the currently active function.
     * @param activeIterationIndices active loop iterations.
     * @returns {*[]} An array with all the active ranges contained in the currently active function.
     */
    updateActiveRangesFunction(functionIndex, activeIterationIndices) {
        let ranges = [];
        this.activeIterations =  [...activeIterationIndices];
        this.skipIds = [];
        this.nodes[functionIndex].ranges.forEach((range) => {
            ranges.push(range);
        });
        this.nodes[functionIndex].childrenIndices.forEach((childIndex) => {
            ranges = ranges.concat(this.getRanges(childIndex));
        });
        ranges.sort((a, b) => ((a.startLineNumber < b.startLineNumber) ? -1 : (a.startLineNumber > b.startLineNumber) ? 1 : 0));
        return ranges;
    }

    /**
     * Recursively determines all ranges of all child nodes that are part of the function
     * of the current node.
     * @param nodeIndex node index of current node.
     * @returns {*[]} An array with all ranges of the current node and all child nodes that are part of the function.
     */
    getRanges(nodeIndex) {
        let ranges = [];
        let end = false;
        this.skipIds.forEach((skipId) => {
            if(this.nodes[nodeIndex].traceId === skipId)
                end = true;
        });
        if(end)
            return ranges;
        if(this.nodes[nodeIndex].nodeType === "Function") {
            ranges.push(this.nodes[nodeIndex].link.range);
        } else if(this.nodes[nodeIndex].nodeType !== "Loop" ||
                nodeIndex === this.activeIterations[0]) {

            if(this.nodes[nodeIndex].nodeType === "Loop") {
                this.activeIterations.shift();
                this.skipIds.push(this.nodes[nodeIndex].traceId);
            }
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