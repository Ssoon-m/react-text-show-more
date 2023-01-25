import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useImperativeHandle,
} from "react";

interface IShowMoreTextState {
  /**
   * - `less` : can text show less
   * - `more` : can text show more
   * - `undefined` : The length of the original text is too short for the text to shrink.
   * @default 'more'
   */
  type: "more" | "less" | undefined;
  text: string;
}

interface Props extends React.ComponentPropsWithoutRef<"p"> {
  /**
   * Text to display on screen
   */
  text: string;
  /**
   * Number of lines of text to display on screen
   */
  lines: number;
  /**
   * Value for window resize event delay
   * @default 100(ms in seconds)
   */
  delay?: number;
  /**
   * ellipsis text ending element
   */
  ellipsis?: React.ReactNode;
  /**
   * Elements for show more text
   */
  moreElement?: React.ReactNode;
  /**
   * Elements for show less text
   */
  lessElement?: React.ReactNode;
  /**
   * delete 'show more' & 'show less' button
   * @default false
   */
  toggleHidden?: boolean;
}

export type ShowMoreTextHandle = {
  onClickShowMoreButton: () => void;
};

const EllipsisTextCut = 4;

const ShowMoreText = React.forwardRef<ShowMoreTextHandle, Props>(
  (
    {
      text: original,
      lines,
      ellipsis = "...",
      delay = 100,
      moreElement = "Show more",
      lessElement = "Show less",
      toggleHidden = false,
      ...props
    },
    ref
  ) => {
    const [{ text, type }, setMoreTextState] = useState<IShowMoreTextState>({
      text: ".",
      type: undefined,
    });

    const textRef = useRef<HTMLDivElement>(null);
    const maxHeight = useRef(0);

    useImperativeHandle(ref, () => ({
      onClickShowMoreButton() {
        handleShowMore();
      },
    }));

    useEffect(() => {
      if (!textRef.current) return;
      maxHeight.current = textRef.current.clientHeight * lines + 1;
      calcLineClamp();
      window.addEventListener("resize", debounce(action, delay));
      return () => window.addEventListener("resize", debounce(action, delay));
    }, [delay, lines]);

    const action = () => {
      if (!textRef.current) return;
      calcLineClamp();
    };

    const debounce = useCallback((callback: () => void, wait: number) => {
      let timeout: ReturnType<typeof setTimeout> | null;
      return () => {
        const later = () => {
          timeout = null;
          callback();
        };
        timeout && clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }, []);

    const binarySearch = (
      start: number,
      end: number,
      middle: number
    ): number | undefined => {
      if (!textRef.current) return;
      if (start > end) return middle;

      middle = Math.floor((start + end) / 2);
      textRef.current.innerText = original.slice(0, middle);

      if (middle === original.length) {
        setMoreTextState({ text: original, type: undefined });
        return;
      }
      if (textRef.current.clientHeight <= maxHeight.current) {
        return binarySearch(middle + 1, end, middle);
      } else if (textRef.current.clientHeight > maxHeight.current) {
        return binarySearch(start, middle - 1, middle);
      }
      binarySearch(start, end, middle);
    };

    const calcLineClamp = () => {
      if (!textRef.current) return;

      const target = binarySearch(0, original.length, 0);
      if (!target) return;

      textRef.current.innerText =
        original.slice(0, target - EllipsisTextCut) + ellipsis;
      setMoreTextState({
        text: original.slice(0, target - EllipsisTextCut) + ellipsis,
        type: "more",
      });
    };

    const handleShowMore = () => {
      if (type === "more") {
        setMoreTextState({ text: original, type: "less" });
      } else {
        calcLineClamp();
        setMoreTextState((prev) => ({
          text: prev.text,
          type: "more",
        }));
      }
    };

    return (
      <>
        <p
          id="react-text-show-more-content"
          ref={textRef}
          style={{ whiteSpace: "pre-wrap" }}
          {...props}
          aria-hidden={type === "less" || type === undefined}
          dangerouslySetInnerHTML={{ __html: text }}
        />

        {type !== undefined && !toggleHidden && (
          <button
            className="react-text-show-more-toggle-button"
            onClick={handleShowMore}
            aria-controls="react-text-show-more-content"
            aria-expanded={type === "less"}
          >
            {type === "less" ? lessElement : moreElement}
          </button>
        )}
      </>
    );
  }
);

ShowMoreText.displayName = "ShowMoreText";
export default ShowMoreText;
