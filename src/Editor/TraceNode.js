/**
 * TracNode class that stores the information of a traced node from tha backend.
 * ranges: Array of all executed {@link monaco.Range}s contained in this node.
 * childrenIndices: Array of all children indices associated with this node.
 * parentIndex: Index of the parent of this node. Null for root node.
 *      For Loop iterations always set to node of first iteration.
 * link: {@link SourceRange} that contains {@link monaco.Range} of link that can be clicked
 *      and relative filepath it leads to. Only set for Function and Loop nodes, otherwise null.
 *      For main function set range is set to method head and file that contains it.
 * outLinks: Array of maximum two {@link SourceRange}s. For Functions function name and if there taken return statement.
 *      For Throws one {@link SourceRange} with range of throw statement. Null for main function.
 * outIndex: Index of parent node the outLink leads back to.
 * iteration: Number of the iteration. Set for Loops otherwise null.
 * c
 * Loop iterations of the same loop have the same traceId.
 * nodeType: String set to "Loop", "Function", "Throw" or "Other"
 *  The following attributes are initially set to null,
 *  but after creation of all TraceNodes assigned in {@link JsonManager},
 *  because they partly depend on other TraceNodes.
 * linkPosition: {@link monaco.Position} the link leads to.
 * outLinkPosition: {@link monaco.Position} both outLinks leads to.
 * outFunctionIndex: Index of the function that contains the node that both outLinks lead to.
 * outLoopIterations: Iterations that are set in the outFunction were the node both outLinks lead to got executed.
 */
class TraceNode {
    /**
     * Maps given json data from the backend onto an instance of this class and extend it with additional information.
     * @param node json data node.
     */
    constructor(node) {
        //ranges: Array of all executed {@link monaco.Range}s contained in this node.
        this.ranges = [];
        if (node.ranges !== undefined)
            node.ranges.forEach((range) => {
                this.ranges.push(new monaco.Range(
                    range.begin.line, range.begin.column, range.end.line, range.end.column + 1));
            });

        //childrenIndices: Array of all children indices associated with this node.
        this.childrenIndices = [];
        if (node.childrenIndices !== undefined)
            node.childrenIndices.forEach((childIndex) => {
                this.childrenIndices.push(childIndex);
            });
        //parentIndex: Index of the parent of this node. Null for root node.
        //      For Loop iterations always set to node of first iteration.
        this.parentIndex = null;
        if (node.parentIndex !== undefined)
            this.parentIndex = node.parentIndex;

        //link: {@link SourceRange} that contains {@link monaco.Range} of link that can be clicked
        //      and relative filepath it leads to. Only set for Function and Loop nodes, otherwise null.
        //      For main function set range is set to method head and file that contains it.
        this.link = null;
        if (node.link !== undefined)
            this.link = new SourceRange(
                new monaco.Range(
                    node.link.begin.line,
                    node.link.begin.column,
                    node.link.end.line,
                    node.link.end.column + 1),
                node.link.filepath);

        //outLinks: Array of maximum two {@link SourceRange}s. For Functions function name and if there taken return statement.
        //      For Throws one {@link SourceRange} with range of throw statement. Null for main function.
        this.outLinks = [];
        if (node.outLinks !== undefined)
            node.outLinks.forEach((nodeOutLink) => {
                this.outLinks.push(new SourceRange(
                    new monaco.Range(
                        nodeOutLink.begin.line,
                        nodeOutLink.begin.column,
                        nodeOutLink.end.line,
                        nodeOutLink.end.column + 1),
                    nodeOutLink.filepath));
            });

        //outIndex: Index of parent node the outLink leads back to.
        this.outIndex = null;
        if (node.outIndex !== undefined && node.outIndex !== 0)
            this.outIndex = node.outIndex;

        //iteration: Number of the iteration. Set for Loops otherwise null.
        this.iteration = null;
        if (node.iteration !== undefined)
            this.iteration = node.iteration;

        //traceId: Unique id that can be used to map each TraceNode to its code block.
        //      Loop iterations of the same loop have the same traceId.
        this.traceId = null;
        if (node.traceId !== undefined)
            this.traceId = node.traceId;

        //nodeType: String set to "Loop", "Function", "Throw" or "Other"
        this.nodeType = "Other";
        if (this.iteration != null) {
            this.nodeType = "Loop";
        } else if (this.link != null) {
            this.nodeType = "Function";
        } else if (this.outIndex != null) {
            this.nodeType = "Throw";
        }

        //----The following attributes are initially set to null.----
        //  After creation of all TraceNodes assigned in {@link JsonManager},
        //  because they partly depend on other TraceNodes.

        //linkPosition: {@link monaco.Position} the link leads to.
        this.linkPosition = null;
        //outLinkPosition: {@link monaco.Position} both outLinks leads to.
        this.outLinkPosition = null;
        //outFunctionIndex: Index of the function that contains the node that both outLinks lead to.
        this.outFunctionIndex = null;
        //outLoopIterations: Iterations that are set in the outFunction were the node both outLinks lead to got executed.
        this.outLoopIterations = [];
    }
}

export default TraceNode;

/**
 * Container that links a monaco.Range and a relative file path together. Used for links.
 */
class SourceRange {
    /**
     * Creates an instance of this class.
     * @param range monaco.Range.
     * @param filepath string of a relative file path.
     */
    constructor(range, filepath) {
        this.range = range;
        this.file = filepath;
    }
}