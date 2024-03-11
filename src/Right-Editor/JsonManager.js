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
        this.activeIterations = [];
        this.skipIds = [];
        this.activeIterationIndex = 0;

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
                            node.outLoopIterations.unshift[parentIndex];
                            if(this.nodes[parentIndex].iteration !== 1)
                                parentIndex = this.nodes[parentIndex].parentIndex;
                        }
                        parentIndex = this.nodes[parentIndex].parentIndex
                    }
                    this.nodes[i].outFunctionIndex = parentIndex;
                }
            }
            this.nodes.forEach((node)=> {
                console.log(node);
            });
    }

    /**
     * Returns the index of the main function in nodes.
     * @returns {number}
     */
    getMain(){
        return 1;
    }

    /**
     *
     */
    iterationNodeIndicesToIterations(iterationIndices){
        let iterations = [];
        iterationIndices.forEach((iterationIndex) => {
            iterations.push(this.nodes[iterationIndex].iteration);
        });
        return iterations;
    }

    /**
     *
     */
    getLastIterationNumber(iterationIndex){
        let iterationIndexId = this.nodes[iterationIndex].traceId;
        let lastIteration = this.nodes[iterationIndex].iteration;
        this.nodes.forEach((node) => {
            if(node.traceId === iterationIndexId)
                lastIteration = node.iteration;
        });
        return lastIteration;
    }

    /**
     * Determines how many loops are active in the current function,
     * assuming that all occurring loops have iteration set to one.
     * @param functionIndex Index of the currently active function.
     * @param iterationsIndices Iterations that are currently selected(beginning function -> end function).
     * @param skipIds
     * @returns {*[]} Array with all the initially active iterations(filled with 1s) of this function.
     * Length equals how many loops are active.
     */
    initIterations(functionIndex, iterationsIndices, skipIds){
        this.skipIds = [...skipIds];
        /*skipIds.forEach((skipId) => {
           this.skipIds.push(skipId);
        });*/
        //console.log("skipidsarray? " +this.skipIds);
        this.activeIterations = [...iterationsIndices];
        /*iterationsIndices.forEach((activeIterationIndex) => {
            this.activeIterations.push(activeIterationIndex);
        });*/
        this.activeIterationIndex = 0;
        this.nodes[functionIndex].childrenIndices.forEach((childIndex) => {
            this.getIterations(childIndex);
        });
        //console.log("tfoiualkjfajfadhf" + this.activeIterations[0]);
        //let a = this.activeIterations;
        //console.log(a);
        return this.activeIterations;
    }


    //TODO init bool übergeben
    /**
     * Recursively determines all active loops that have this node as a grandparent,
     * assuming that all occurring loops have iteration set to one.
     * @param nodeIndex node index of current node.
     * @param iterationsIndices
     * @param activeIterationIndex index of the next iteration in activeIterations that is tp be selected.
     * @returns {[*]} Array with all the initially active iterations(filled with 1s).
     * That have the current node as a grandparent and are part of this nodes function.
     */
    getIterations(nodeIndex){
        let end = false;
        this.skipIds.forEach((skipId) => {
            if(this.nodes[nodeIndex].traceId === skipId)
                end = true;
        });
        if(end){
            console.log("skipped" + this.nodes[nodeIndex].traceId);
            return this.activeIterations;}

        let skip = true;
        if(this.nodes[nodeIndex].nodeType !== "Function" && this.nodes[nodeIndex].nodeType !== "Loop")
            skip = false;
        if(this.activeIterationIndex + 1 > this.activeIterations.length && this.nodes[nodeIndex].iteration === 1){
            this.activeIterations.push(nodeIndex);
            this.activeIterationIndex++;
            skip = false;
            this.skipIds.push(this.nodes[nodeIndex].traceId);
        }
        else if(!(this.activeIterationIndex + 1 > this.activeIterations.length) && this.nodes[nodeIndex].iteration === this.activeIterations[this.activeIterationIndex]){
            this.activeIterationIndex++;
            this.skipIds.push(this.nodes[nodeIndex].traceId);
            skip = false;
        }
        if(!skip) {
            this.nodes[nodeIndex].childrenIndices.forEach((childIndex) => {
                this.activeIterations.concat(this.getIterations(childIndex));
            });
        }
        //return this.activeIterations;
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
        //activeIterationIndices.forEach((activeIterationIndex) => {
        //this.activeIterations.push(activeIterationIndex); });
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
                nodeIndex === this.activeIterations[0]) &&
            this.nodes[nodeIndex].nodeType !== "Function") {
            if(this.nodes[nodeIndex].nodeType === "Loop") {
                this.activeIterations.shift();
                this.skipIds.push(this.nodes[nodeIndex].traceId);
            }
            this.nodes[nodeIndex].childrenIndices.forEach((childIndex) => {
                jumps = jumps.concat(this.getJumps(childIndex));
            });
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
        /*activeIterationIndices.forEach((activeIterationIndex) => {
            this.activeIterations.push(activeIterationIndex);
        });*/
        console.log("yupp" + activeIterationIndices + this.activeIterations);
        this.skipIds = [];
        this.nodes[functionIndex].ranges.forEach((range) => {
            ranges.push(range);
        });
        this.nodes[functionIndex].childrenIndices.forEach((childIndex) => {
            ranges = ranges.concat(this.getRanges(childIndex));
        });
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
        console.log(this.activeIterations[0] + " " + nodeIndex);
        if(this.nodes[nodeIndex].nodeType === "Function") {
            ranges.push(this.nodes[nodeIndex].link.range);
        } else if(this.nodes[nodeIndex].nodeType !== "Loop" ||
                nodeIndex === this.activeIterations[0]) {

            if(this.nodes[nodeIndex].nodeType === "Loop") {
                console.log("activee "+nodeIndex);
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