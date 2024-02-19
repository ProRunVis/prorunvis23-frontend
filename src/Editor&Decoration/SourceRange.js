class TraceNode {
    constructor(typ, ranges, childs, parent, link, outlinks, out, iteration) {
        this.typ = typ;
        this.range = ranges;
        this.childs = childs;
        this.parent = parent;
        this.link = link;
        this.outlinks = outlinks;
        this.out = out;
        this.iteration = iteration;
    }
}

export class SourceRange {
    constructor(startcol, endcol, startrow, endrow, file) {
        this.startcol = startcol;
        this.endcol = endcol;
        this.startrow = startrow;
        this.endrow = endrow;
        this.file = file;
    }
}