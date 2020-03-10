const electron = require('electron');
const {ipcRenderer} = electron;

const addTagButton = document.getElementById('addTagButton');
addTagButton.addEventListener('click',handleAddTag);

const form = document.querySelector('form');
form.addEventListener('submit', submitForm);

function submitForm(event){
    event.preventDefault();
    ipcRenderer.send('item:add', getFileObject());
}

function getFileObject(){
    
    let file = document.getElementById('image').files[0];
    return {
        name: getFileName(file.name),
        size: getFileSize(file.size),
        type: getFileExtension(file.name),
        path: getPathWithoutFileName(file.path),
        tags: getTagsValue()
    }
}

function getFileName(fileName){
    return fileName.substring(0, fileName.lastIndexOf('.'));
}

function getPathWithoutFileName(path){
    return path.substring(0, path.lastIndexOf('\\')+1);
}

function getFileExtension(fileName){
    return fileName.substring(fileName.lastIndexOf('.')+1, fileName.length);
}

function getFileSize(size){
    let units = ['KB','MB','GB'];

    if(Math.abs(size) < 1024) {
        return size + ' B';
    }

    let u = -1;
    do{
        size /= 1024;
        ++u;
    } while(Math.abs(size) >= 1024 && u < units.length -1);

    return size.toFixed(1) + ' ' + units[u];
}

function handleAddTag(){
    const tagContainer = document.getElementById('tagContainer');
    const tagName = document.getElementById('tagName').value;
    if(validateTag(tagName,tagContainer)){
        const tagLabel = `<label name="tag" class="tag">${tagName}</label>`;
        tagContainer.insertAdjacentHTML("beforeend", tagLabel);
    }
}