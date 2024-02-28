import * as moanco from "monaco-editor";
import SourceRange from "./SourceRange";
export class TraceNode {
    constructor(typ, sourceRanges, childs, parent, link, outlinks, out, iteration) {
        this.typ = typ;
        this.sourceRanges = sourceRanges;
        this.childs = childs;
        this.parent = parent;
        this.link = link;
        this.outlinks = outlinks;
        this.out = out;
        this.iteration = iteration;
    }
}
export default TraceNode;