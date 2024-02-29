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

    constructor(t1) {
        let test = [];

        test = '[{"ranges":[],"childrenIndices":[1],"outLinks":[],"outIndex":0,"traceId":"root"},{"ranges":[{"begin":{"line":4,"column":9},"end":{"line":4,"column":18}},{"begin":{"line":5,"column":13},"end":{"line":5,"column":17}}],"childrenIndices":[2],"parentIndex":0,"outLinks":[],"outIndex":0,"traceId":"4"},{"ranges":[{"begin":{"line":8,"column":13},"end":{"line":8,"column":22}}],"childrenIndices":[3],"parentIndex":1,"outLinks":[],"outIndex":0,"traceId":"6"},{"ranges":[{"begin":{"line":4,"column":9},"end":{"line":4,"column":18}},{"begin":{"line":5,"column":13},"end":{"line":5,"column":17}}],"childrenIndices":[],"parentIndex":2,"link":{"begin":{"line":8,"column":17},"end":{"line":8,"column":19}},"outLinks":[{"begin":{"line":3,"column":24},"end":{"line":3,"column":26}}],"outIndex":2,"traceId":"0"}]';
            //this.asyncCall();
        test = JSON.parse(test);

        //console.log(test[0]);
        for(let i=0; i<i.length; i++)
            this.nodes.push(test[i]);


        //this.nodes.push(t2);
        //this.nodes.push(t2);
        //this.nodes.push(new TraceNode("main",[(new SourceRange(new moanco.Range(1,1,2,2), "")), (new SourceRange(new moanco.Range(3,3,4,4)))], [], null, null, null, null, null));
        //this.nodes.push(new TraceNode("main",[(new SourceRange(new moanco.Range(1,1,2,2), "")), (new SourceRange(new moanco.Range(1,1,2,2)))], [], 0, null, null, null, null));
        //this.nodes.push(new TraceNode("main",[(new SourceRange(new moanco.Range(1,1,2,2), "")), (new SourceRange(new moanco.Range(1,1,2,2)))], [], 0, null, null, null, null));
        /*fetch('./data.json')
            .then((response) => response.json())
            .then((json) => console.log(json));*/
    }

    async asyncCall() {
        let test;

        fetch('../../public/data.json')
            .then((response) => response.json())
            .then((json) => test = JSON.parse(json));
        return test;
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
        if(selectedIterations.length === 0){
            let ranges = [];
            if(this.nodes[selectedFunction].sourceRanges.length !== 0) {
                for (let i = 0; i < this.nodes[selectedFunction].sourceRanges.length; i++) {
                    ranges.push(this.nodes[selectedFunction].sourceRanges[i].range);
                }
                if (this.nodes[selectedFunction].childs != null && this.nodes[selectedFunction].childs.length !== 0) {
                    for (let i = 0; i < this.nodes[selectedFunction].childs.length; i++) {
                        let childRanges = this.getRanges(this.nodes[selectedFunction].childs[i]);
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
        if(this.nodes[node].link === null || this.nodes[node].iteration === 1 && this.nodes[node].sourceRanges.length !== 0) {
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