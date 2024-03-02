import TraceNode from "./TraceNode";
import SourceRange from "./TraceNode";
class JsonManager {
    constructor(jsonString) {
        this.nodes = [];
        let jsonData = JSON.parse(jsonString);
        if(jsonData.length > 0) {
            for (let i = 0; i < jsonData.length; i++) {
                this.nodes.push(new TraceNode(jsonData[i]));
            }
            for (let i = 2; i < this.nodes.length; i++) {
                if(this.nodes[i].nodeType === "Throw")
                    this.nodes[i].outLinkPosition = this.nodes[this.nodes[i].outIndex].ranges[0].getStartPosition();
                if(this.nodes[i].nodeType === "Function") {
                    this.nodes[i].linkPosition = this.nodes[i].outLinks[this.nodes[i].outLinks.length - 1].range.getStartPosition();
                    this.nodes[i].outLinkPosition = this.nodes[i].link.range.getStartPosition();
                }
                if(this.nodes[i].nodeType === "Function" || this.nodes[i].nodeType === "Throw") {
                    let parent = this.nodes[this.nodes[i].parentIndex];
                    while(parent.nodeType !== "Function") {
                        if(parent.nodeType === "Loop") {
                            this.nodes[i].outLoopiterations.unshift[parent.iteration];
                            if(parent.iteration !== 1) {
                                parent = this.nodes[parent.parentIndex];
                            }
                        }
                        parent = this.nodes[parent.parentIndex];
                    }
                }
            }
        }
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
            let childJumps
            if(this.nodes[functionIndex].childrenIndices.length>0) {
                for (let i = 0; i < this.nodes[functionIndex].childrenIndices.length; i++) {
                    childJumps = this.getJumps(this.nodes[functionIndex].childrenIndices[i]);
                }
            }
            if(childJumps.length>0) {
                for (let j = 0; j < childJumps.length; j++) {
                    jumps.push(childJumps[j]);
                }
            }
        }
        return jumps;
     }
    getJumps(nodeIndex) {
        let jumps = [];
        let childJumps = [];
        if(this.nodes[nodeIndex].nodeType === "Function" || this.nodes[nodeIndex].nodeType === "Throw"){
            jumps.push(this.nodes[nodeIndex]);
        }
        if(this.nodes[nodeIndex].childrenIndices.length > 0) {
            for (let i = 0; i < this.nodes[nodeIndex].childrenIndices.length; i++) {
                childJumps = this.getJumps(this.nodes[nodeIndex].childrenIndices[i]);
            }
        }
        if(childJumps.length > 0) {
            for (let j = 0; j < childJumps.length; j++) {
                jumps.push(childJumps[j]);
            }
        }
        return jumps;
    }
    updateActiveRangesFunction(functionIndex, selectedIterations) {
        if (selectedIterations.length === 0) {
            let ranges = [];
            if (this.nodes[functionIndex].ranges.length !== 0) {
                for (let i = 0; i < this.nodes[functionIndex].ranges.length; i++) {
                    ranges.push(this.nodes[functionIndex].ranges[i]);
                }
                if (this.nodes[functionIndex].childrenIndices.length !== 0) {
                    for (let i = 0; i < this.nodes[functionIndex].childrenIndices.length; i++) {
                        let childRanges = this.getRanges(this.nodes[functionIndex].childrenIndices[i]);
                        if (childRanges.length > 0) {
                            for (let j = 0; j < childRanges.length; j++) {
                                ranges.push(childRanges[j]);
                            }
                        }
                    }
                }
            }
            return ranges;
        }
    }

    getRanges(nodeIndex) {
        let ranges = [];
        if(this.nodes[nodeIndex].nodeType === "Function"){
            ranges.push(this.nodes[nodeIndex].link.range);
        }
        if((this.nodes[nodeIndex].nodeType === "Loop" && this.nodes[nodeIndex].iteration === 1) || this.nodes[nodeIndex].nodeType === "Throw" || this.nodes[nodeIndex].nodeType === "Other") {
            if(this.nodes[nodeIndex].ranges.length !== 0) {
                for (let i = 0; i < this.nodes[nodeIndex].ranges.length; i++) {
                    ranges.push(this.nodes[nodeIndex].ranges[i]);
                }
            }
            if (this.nodes[nodeIndex].childrenIndices.length !== 0) {
                for (let i = 0; i < this.nodes[nodeIndex].childrenIndices.length; i++) {
                    ranges.push(this.getRanges(this.nodes[nodeIndex].childrenIndices[i]));
                }
            }
        }
        return ranges;
    }
}
export default JsonManager;