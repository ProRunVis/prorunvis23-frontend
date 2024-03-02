import TraceNode from "./TraceNode";
import SourceRange from "./TraceNode";
class JsonManager {
    constructor(jsonString) {
        this.nodes = [];
        let jsonData = JSON.parse(jsonString);
            jsonData.forEach((jsonData) => {
                this.nodes.push(new TraceNode(jsonData));
            });

            this.nodes.forEach((node) => {
                if(node.nodeType === "Throw")
                    node.outLinkPosition = this.nodes[node.outIndex].ranges[0].getStartPosition();
                if(node.nodeType === "Function") {
                    node.linkPosition = node.outLinks[node.outLinks.length - 1].range.getStartPosition();
                    node.outLinkPosition = node.link.range.getStartPosition();
                }

                if(node.nodeType === "Function" || node.nodeType === "Throw") {
                    let parent = this.nodes[node.parentIndex];
                    while(parent.nodeType !== "Function") {
                        if(parent.nodeType === "Loop") {
                            node.outLoopiterations.unshift[parent.iteration];
                            if(parent.iteration !== 1)
                                parent = this.nodes[parent.parentIndex];
                        }
                        parent = this.nodes[parent.parentIndex];
                    }
                }
            });
    }
    getMain(){
        return 1;
    }
    updateActiveLoopsFunction(selectedFunction, selectedIterations){
        //if [] assume all iteration are zero
    }
    updateJumpsFunction(functionIndex, selectedIterations){
        let jumps = [];
        if(selectedIterations.length === 0) {
            let childJumps = [];
            this.nodes[functionIndex].childrenIndices.forEach((childIndex) => {
                jumps.concat(this.getJumps(childIndex));
            });
        }
        return jumps;
     }
    getJumps(nodeIndex) {
        let jumps = [];
        if(this.nodes[nodeIndex].nodeType === "Function" || this.nodes[nodeIndex].nodeType === "Throw")
            jumps.push(this.nodes[nodeIndex]);
        this.nodes[nodeIndex].childrenIndices.forEach((childIndex) => {
            jumps.concat(this.getJumps(childIndex));
        });
        return jumps;
    }
    updateActiveRangesFunction(functionIndex, selectedIterations) {
        if(selectedIterations.length === 0) {
            let ranges = [];
            this.nodes[functionIndex].ranges.forEach((range) => {
                ranges.push(range);
            });
            this.nodes[functionIndex].childrenIndices.forEach((childIndex) => {
                ranges.concat(this.getRanges(childIndex));
            });
            return ranges;
        }
    }

    getRanges(nodeIndex) {
        let ranges = [];
        if(this.nodes[nodeIndex].nodeType === "Function") {
            ranges.push(this.nodes[nodeIndex].link.range);
        } else if(!(this.nodes[nodeIndex].nodeType === "Loop") || this.nodes[nodeIndex].iteration === 1) {
            this.nodes[nodeIndex].ranges.forEach((range) => {
                ranges.push(range);
            });
            this.nodes[nodeIndex].childrenIndices.forEach((childIndex) => {
                ranges.concat(this.getRanges(childIndex));
            });
        }
        return ranges;
    }
}
export default JsonManager;