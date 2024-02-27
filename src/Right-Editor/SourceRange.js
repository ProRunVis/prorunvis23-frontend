import React, { useEffect, useRef, useState, useMemo } from "react";
class TraceNode {
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

export class SourceRange {
    constructor(range, file) {
        this.range = range;
        this.file = file;
    }
}