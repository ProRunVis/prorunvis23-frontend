import React, { useEffect, useRef, useState, useMemo } from "react";
import * as moanco from "monaco-editor";

class SourceRange {
    constructor(range, file) {
        this.range = range;
        this.file = file;
    }
}
export default SourceRange;
