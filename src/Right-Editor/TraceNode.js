import RightComponent from "./RightComponent";

class TraceNode
{
    constructor(node) {
        this.ranges = [];
        if(node.ranges !== undefined && node.ranges.length > 0)
            for(let i = 0; i < node.ranges.length; i++)
                this.ranges.push(new monaco.Range(node.ranges[i].begin.line, node.ranges[i].begin.column, node.ranges[i].end.line, node.ranges[i].end.column));

        this.childrenIndices = [];
        if(node.childrenIndices !== undefined && node.childrenIndices.length > 0)
            for(let i = 0; i < node.childrenIndices.length; i++)
                this.childrenIndices.push(node.childrenIndices[i]);

        this.parentIndex = null;
        if(node.parentIndex !== undefined)
            this.parentIndex = node.parentIndex;

        this.link = null;
        if(node.link !== undefined)
            this.link = new SourceRange(new monaco.Range(node.link.begin.line, node.link.begin.column, node.link.end.line, node.link.end.column), node.link.file);

        this.outLinks = [];
        if(node.outLinks !== undefined && node.outLinks.length > 0)
            for (let i = 0; i < node.outLinks.length; i++)
                this.outLinks.push(new SourceRange(new monaco.Range(node.outLinks[i].begin.line, node.outLinks[i].begin.column, node.outLinks[i].end.line, node.outLinks[i].end.column), node.outLinks[i].file));

        this.outIndex = null;
        if(node.outIndex !== undefined && node.outIndex !== 0)
            this.outIndex = node.outIndex;

        this.iteration = null;
        if(node.iteration !== undefined)
            this.iteration = node.iteration;

        this.traceId = null;
        if(node.traceId !== undefined){
            this.traceId = node.traceId;
        }

        this.nodeType = "Other";
        if(this.iteration != null) {
            this.nodeType = "Loop";
        } else if(this.link != null) {
            this.nodeType = "Function";
        } else if(this.outIndex != null) {
            this.nodeType = "Throw";
        }

        this.linkPosition = null;
        this.outLinkPosition = null;
        this.outFunctionIndex = null;
        this.outLoopiterations = [];

        //TODO Throw exception if out set but outlink isnt vice versa
        //TODO Throw exception if anything isnt set that should be set
    }
}
export default TraceNode;
class SourceRange
{
    constructor(range, file){
        this.range = range;
        this.file = file;
    }
}