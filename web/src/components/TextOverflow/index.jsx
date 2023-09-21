import './style.scss';

function TextOverflow({ text, width = 20, ...props }) {
    if(Boolean(text) != true) return ""
    
    let renderText = text.slice(0, (width / 2)) + "..." + text.slice(-(width / 2));
    if (text.length <= width) {
        renderText = text;
    }
    return (
        <span className="text-overflow" {...props}>
            {renderText}
        </span>
    );
}

export default TextOverflow;
