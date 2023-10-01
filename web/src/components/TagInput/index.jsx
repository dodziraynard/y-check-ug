import './style.scss';
import { useState, useEffect } from 'react'

function TagInput({ tags = [], selectedTags, setSelectedTags, maxSelection = null, heading = "Click to select", searchable = false }) {
    const [disabled, setDisabled] = useState(false)
    let sortedTags = [...tags]
    sortedTags = sortedTags.sort((a, b) => b.toUpperCase() - a.toUpperCase())

    const handleTagClick = (tag) => {
        if (selectedTags?.includes(tag)) {
            setSelectedTags(selectedTags?.filter((t) => t !== tag))
        } else {
            if (selectedTags?.length >= (maxSelection || tags?.length)) {
                return
            }
            setSelectedTags([...selectedTags, tag])
        }
    }

    useEffect(() => {
        setDisabled(selectedTags?.length >= (maxSelection || tags?.length))
    }, [selectedTags, maxSelection])

    return (
        <div className="tag-input">
            <div className="selected-tags">
                {selectedTags?.length === 0 && <small className='m-0 p-0 text-warning'><b>None is selected</b></small>}
                {selectedTags?.map((tag, index) => (
                    <span key={index} onClick={() => handleTagClick(tag)}>{tag} <i className="bi bi-x-lg"></i> </span>
                ))}
            </div>
            {heading && tags?.length > 0 && <small className='m-0'>{heading}</small>}
            <div className="tags">
                {tags?.length > 0 ? sortedTags?.map((tag, index) => (
                    <span
                        key={index}
                        className={disabled ? "disabled" : ""}
                        onClick={() => handleTagClick(tag)}>
                        {tag}
                    </span>
                )) : <small className='text-muted m-0'><b>(No options available)</b></small>}
            </div>
        </div>
    );
}

export default TagInput;
