class JsonManager {
    nodes = [];
    constructor(jsonString) {
        let jsonData = JSON.parse(jsonString);
        if(jsonData.length > 0) {
            for (let i = 0; i < jsonData.length; i++) {
                this.nodes.push(new TraceNode(jsonData[i]));
            }
            for (let i = 0; i < this.nodes.length; i++) {
                if(this.nodes.nodeType === "Throw")
                    this.nodes[i].outLinkPosition = this.nodes[this.nodes[i].outIndex].ranges[0].getStartPosition();
                if(this.nodes.nodeType === "Function" || this.nodes.nodeType === "Throw") {
                    let parent = this.nodes[this.nodes[i].parentIndex];
                    while(parent.nodeType !== "Function") {
                        if(parent.nodeType === "Loop") {
                            this.nodes[i].outLoopIterations.unshift[parent.iterations];
                            if(parent.iterations !== 1) {
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
        //if [] assume all iterations are zero
    }
    updateJumpsFunction(selectedFunction, selectedIterations){
        let jumps = [];
        if(selectedIterations.length === 0) {
            for (let i = 0; i < this.nodes.length; i++) {
                if(( this.nodes[i].link !== undefined || this.nodes[i].outlink !== undefined) && this.nodes[i].iteration === undefined ){
                    jumps.push(this.nodes[i]);
                }
            }
        }
        return jumps;
     }
    updateActiveRangesFunction(selectedFunction, selectedIterations){
        console.log("test" + this.nodes[selectedFunction].childrenIndices);
        if(selectedIterations.length === 0){
            let ranges = [];
            if(this.nodes[selectedFunction].ranges.length !== 0) {
                for (let i = 0; i < this.nodes[selectedFunction].ranges.length; i++) {
                    ranges.push(new monaco.Range(this.nodes[selectedFunction].ranges[i].begin.line, this.nodes[selectedFunction].ranges[i].begin.column, this.nodes[selectedFunction].ranges[i].end.line, this.nodes[selectedFunction].ranges[i].end.column + 1));
                }
                if (this.nodes[selectedFunction].childrenIndices != null && this.nodes[selectedFunction].childrenIndices.length !== 0) {
                    for (let i = 0; i < this.nodes[selectedFunction].childrenIndices.length; i++) {
                        let childRanges = this.getRanges(this.nodes[selectedFunction].childrenIndices[i]);
                        for (let j = 0; j < childRanges.length; j++) {
                            ranges.push(childRanges[j]);
                        }
                    }
                }
            }
            return ranges;
        }

    }
    getRanges(node) {
        let ranges = [];
        if(this.nodes[node].link !== undefined && this.nodes[node].iteration === undefined){
            ranges.push(new monaco.Range(this.nodes[node].link.begin.line, this.nodes[node].link.begin.column, this.nodes[node].link.end.line, this.nodes[node].link.end.column + 1));
        }
        if((this.nodes[node].link === undefined || this.nodes[node].iteration === 1) && this.nodes[node].ranges.length !== 0) {
            if(this.nodes[node].ranges.length !== 0) {
                for (let i = 0; i < this.nodes[node].ranges.length; i++) {
                    ranges.push(new monaco.Range(this.nodes[node].ranges[i].begin.line, this.nodes[node].ranges[i].begin.column, this.nodes[node].ranges[i].end.line, this.nodes[node].ranges[i].end.column + 1));
                }
            }
            if (this.nodes[node].childrenIndices.length !== 0) {
                for (let i = 0; i < this.nodes[node].childrenIndices.length; i++) {
                    ranges.push(this.getRanges(i));
                }
            }
            return ranges;
        }
        return [];
    }
}
export default JsonManager;