import React from "react";
interface Props extends React.ComponentPropsWithoutRef<"div"> {
    text: string;
    lines: number;
    /**
     * Value for window resize event delay
     * @default 100(ms in seconds)
     */
    delay?: number;
    ellipsis?: React.ReactNode;
    moreElement?: React.ReactNode;
    lessElement?: React.ReactNode;
    /**
     * @default false
     */
    toggleHidden?: boolean;
}
export type ShowMoreTextHandle = {
    onClickShowMoreButton: () => void;
};
declare const ShowMoreText: React.ForwardRefExoticComponent<Props & React.RefAttributes<ShowMoreTextHandle>>;
export default ShowMoreText;
