function validateTag(tagName,tagContainer){
    let tags = getTagsValue(tagContainer);
    if(tags.length === 0){
        return true;
    }

    return !tags.some(tag => tag === tagName);
}

function getTagsValue(tagContainer){
    const tagLabels = tagContainer.querySelectorAll('label');
    let tags = [];
    
    for(let i=0;i<tagLabels.length;i++){
        tags.push(tagLabels[i].textContent.replace('#', ''));
    }

    return tags;
}