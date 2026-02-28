// Helper: wrap each word in a clip+inner div for animated headlines
import React from "react";
export default function WordSplit({ children, tag: Tag = "h2", className }) {
    const words = String(children).split(" ");
    return (
        <Tag className={className}>
            {words.map((w, i) => (
                <span key={i} className="word-clip" style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}>
                    <span className="clip-inner" style={{ display: "inline-block", transform: "translateY(105%)" }}>
                        {w}{i < words.length - 1 ? "\u00A0" : ""}
                    </span>
                </span>
            ))}
        </Tag>
    );
}
