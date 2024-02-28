import SourceRange from "./SourceRange";
import TraceNode from "./TraceNode";
import * as moanco from "monaco-editor";

class JsonManager{
    nodes = [];
    tracedFunctions = [];
    selectedIterations = [];
    jumps = [];
    highlighted = [];
    traceNodes= [];

    constructor(t1, t2) {
        this.nodes.push(t1);
        this.nodes.push(t2);
        this.nodes.push(t2);
        //this.nodes.push(new TraceNode("main",[(new SourceRange(new moanco.Range(1,1,2,2), "")), (new SourceRange(new moanco.Range(1,1,2,2)))], [1, 2], null, null, null, null, null));
        //this.nodes.push(new TraceNode("main",[(new SourceRange(new moanco.Range(1,1,2,2), "")), (new SourceRange(new moanco.Range(1,1,2,2)))], [], 0, null, null, null, null));
        //this.nodes.push(new TraceNode("main",[(new SourceRange(new moanco.Range(1,1,2,2), "")), (new SourceRange(new moanco.Range(1,1,2,2)))], [], 0, null, null, null, null));
        /*fetch('./data.json')
            .then((response) => response.json())
            .then((json) => console.log(json));*/
    }
    getMain(){
        return 0;
    }
    updateActiveLoopsFunction(selectedFunction, selectedIterations){
        //TODO if [] assume all iterations are zero
    }
    updateJumpsFunction(selectedFunction, selectedIterations){

    }
    updateActiveRangesFunction(selectedFunction, selectedIterations){

        if(selectedIterations.length == 0){
            let ranges = [];
            for (let i = 0; i < this.nodes[selectedFunction].sourceRanges.length; i++) {
                ranges.push(this.nodes[selectedFunction].sourceRanges[i].range);
            }
            if (this.nodes[selectedFunction].childs != null) {
                for (let i = 0; i < this.nodes[selectedFunction].childs.length; i++) {
                    let childRanges = this.getRanges(this.nodes[selectedFunction].childs[i]);
                    for(let j = 0; j<childRanges.length; j++){
                        ranges.push(childRanges[j]);
                    }
                }
            }

            for (let i = 0; i < ranges.length; i++){
                console.log("range" + i + ranges[i]);
            }
            return ranges;
        }

    }
    getRanges(node) {
        if(this.nodes[node].link === null || this.nodes[node].iteration === 1) {
            let ranges = [];
            for (let i = 0; i < this.nodes[node].sourceRanges.length; i++) {
                ranges.push(this.nodes[node].sourceRanges[i].range);
            }
            if (this.nodes[node].childs.length != 0) {
                for (let i = 0; i < this.nodes[node].childs.length; i++) {
                    ranges.push(this.getRanges(i));
                }
            }
            return ranges;
        }
        return [];
    }
}
export default JsonManager;