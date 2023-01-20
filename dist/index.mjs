import React, { useState, useRef, useImperativeHandle, useEffect, useCallback } from 'react';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var __assign = function () {
  __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
}

var ShowMoreText = React.forwardRef(function (_a, ref) {
    var original = _a.text, lines = _a.lines, _b = _a.ellipsis, ellipsis = _b === void 0 ? "..." : _b, _c = _a.delay, delay = _c === void 0 ? 100 : _c, _d = _a.moreElement, moreElement = _d === void 0 ? "Show more" : _d, _e = _a.lessElement, lessElement = _e === void 0 ? "Show less" : _e, _f = _a.toggleHidden, toggleHidden = _f === void 0 ? false : _f, props = __rest(_a, ["text", "lines", "ellipsis", "delay", "moreElement", "lessElement", "toggleHidden"]);
    var _g = useState({
        text: ".",
        type: undefined,
    }), _h = _g[0], text = _h.text, type = _h.type, setMoreTextState = _g[1];
    var textRef = useRef(null);
    var maxHeight = useRef(0);
    useImperativeHandle(ref, function () { return ({
        onClickShowMoreButton: function () {
            handleShowMore();
        },
    }); });
    useEffect(function () {
        if (!textRef.current)
            return;
        maxHeight.current = textRef.current.clientHeight * lines + 1;
        calcLineClamp();
        window.addEventListener("resize", debounce(action, delay));
        return function () { return window.addEventListener("resize", debounce(action, delay)); };
    }, [delay, lines]);
    var action = function () {
        if (!textRef.current)
            return;
        calcLineClamp();
    };
    var debounce = useCallback(function (callback, wait) {
        var timeout;
        return function () {
            var later = function () {
                timeout = null;
                callback();
            };
            timeout && clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }, []);
    var binarySearch = function (start, end, middle) {
        if (!textRef.current)
            return;
        if (start > end)
            return middle;
        middle = Math.floor((start + end) / 2);
        textRef.current.innerText = original.slice(0, middle);
        if (middle === original.length) {
            setMoreTextState({ text: original, type: undefined });
            return;
        }
        if (textRef.current.clientHeight <= maxHeight.current) {
            return binarySearch(middle + 1, end, middle);
        }
        else if (textRef.current.clientHeight > maxHeight.current) {
            return binarySearch(start, middle - 1, middle);
        }
        binarySearch(start, end, middle);
    };
    var calcLineClamp = function () {
        if (!textRef.current)
            return;
        var target = binarySearch(0, original.length, 0);
        if (!target)
            return;
        textRef.current.innerText = original.slice(0, target - 4) + ellipsis;
        setMoreTextState({
            text: original.slice(0, target - 4) + ellipsis,
            type: "more",
        });
    };
    var handleShowMore = function () {
        if (type === "more") {
            setMoreTextState({ text: original, type: "less" });
        }
        else {
            calcLineClamp();
            setMoreTextState(function (prev) { return ({
                text: prev.text,
                type: "more",
            }); });
        }
    };
    return (React.createElement(React.Fragment, null,
        React.createElement("p", __assign({ id: "react-read-more-text-content", ref: textRef, style: { whiteSpace: "pre-wrap" } }, props, { "aria-hidden": type === "less" || type === undefined, dangerouslySetInnerHTML: { __html: text } })),
        type !== undefined && !toggleHidden && (React.createElement("button", { onClick: handleShowMore, "aria-controls": "react-read-more-text-content", "aria-expanded": type === "less" }, type === "less" ? lessElement : moreElement))));
});
ShowMoreText.displayName = "ShowMoreText";

export { ShowMoreText };
//# sourceMappingURL=index.mjs.map
