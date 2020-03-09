const electron = require('electron');
const {ipcRenderer, url} = electron;
const leftPanel = document.querySelector('#leftPanel');
const connection = require('./connect');

document.addEventListener('DOMContentLoaded', (event) => {
    ipcRenderer.on('item:add',function(e,item){
        connection.insert(item,createImageRow,item.tags);
    });

    getAllImages();

    const addButton = document.getElementById('addButton');
    addButton.addEventListener('click',function(){
        ipcRenderer.send('addItem');
    });

    const addTagButton = document.getElementById('add_tagName');
    addTagButton.addEventListener('click',function(){
        const imageData = document.getElementById('imageData');
        let imageId = imageData.getAttribute('id-image');
        const tagContainer = document.getElementById('tags');
        let tagName = document.getElementById('addTagInput').value;
        
        if(validateTag(tagName,tagContainer)){
            connection.checkTags(imageId,[tagName],updateTags);
        }
    });
});

function createDeleteButton(){
    const button = document.createElement('span');
    const buttonText = document.createTextNode('x');
    button.appendChild(buttonText);
    button.setAttribute('title','Eliminar');
    button.className = 'close-small-button';
    button.addEventListener('click', removeItem);

    return button;
}

function getAllImages(){
    let sql = `SELECT id,name FROM images ORDER BY id`;
    connection.fetchAll(sql,createDatabaseElements);
}

function createDatabaseElements(result){
    leftPanel.innerHTML = `<div class="left-panel-item title">Imágenes</div>`;
    result.forEach(function(item){
        createImageRow(item.id,item);
    });
}

function createImageRow(id,item){
    const a = document.createElement('a');
    a.addEventListener('click',showItem);
    a.setAttribute('id',id);
    a.setAttribute('name','image');
    a.className = 'left-panel-item';

    const imageName = document.createElement('span');
    imageName.className = 'image-text';
    const imageNameText = document.createTextNode(item.name);
    imageName.appendChild(imageNameText);
    const deleteButton = createDeleteButton();
    a.appendChild(imageName);
    a.appendChild(deleteButton);
    leftPanel.appendChild(a);
}

function removeItem(e){
    e.stopPropagation();
    const imageData = document.getElementById('imageData');
    let a = e.target.closest('a');
    let id = a.getAttribute('id');
    connection.delete(id);
    a.remove();
    if(a.classList.contains('selected')){
        imageData.classList.add('hidden');
    }
}

function showItem(){
    let id = this.getAttribute('id');
    setImageSelected.call(this);
    let sql = 'SELECT * FROM images WHERE id = "' + id + '";';
    connection.get(sql, showSingleElement);
}

function setImageSelected(){
    var allImages = document.getElementsByName('image');
    allImages.forEach(function(image){
        image.classList.remove('selected')
    });
    this.classList.add('selected');
}

function showSingleElement(element){
    const imageFile = document.getElementById('imageFile');
    const imageData = document.getElementById('imageData');
    const img = document.createElement('img');
    img.setAttribute('src',element.path + element.name + '.' + element.type);

    imageFile.innerHTML = '';
    imageFile.appendChild(img);

    imageData.setAttribute('id-image',element.id);
    imageData.classList.remove('hidden');

    updateTags(element.id);
}

function updateTags(imageId){
    const query = 'select t.* from tags t inner join tagged tg on t.id = tg.tagId and tg.ImageId = ' + imageId;
    connection.fetchAll(query,addTags);
}

function addTags(tags){
    const tagContainer = document.getElementById('tags');
    tagContainer.innerHTML = '';
    tags.forEach(function(tag){
        let tagName = tag.name;
        if(!!tagName){
            let tagLabel = `<label tag-id="${tag.id}" name="tag" class="tag">#${tagName}</label>`;
            tagContainer.insertAdjacentHTML("beforeend", tagLabel);
        }
    });

    for(var i=0; i<tagContainer.children.length;i++){
        tagContainer.children[i].addEventListener('click',function(){
            const activeFilters = document.getElementById('activeFilters');

            if(validateTag(this.textContent.replace('#', ''),activeFilters)){
                toggleFilters(activeFilters,this);
            }
        });
    }
}

function toggleFilters(activeFilters,tag){
    const id = tag.getAttribute('tag-id');
    updateFilter(activeFilters,tag.textContent,id);
    reloadImages(activeFilters);
}

function reloadImages(activeFilters){
    let filterIds = '';
    
    for(let i=0;i<activeFilters.children.length;i++){
        if(filterIds === ''){
            filterIds += activeFilters.children[i].getAttribute('tag-id');
        }else{
            filterIds += ',' + activeFilters.children[i].getAttribute('tag-id');
        }
            
    }
    leftPanel.innerHTML = '';

    let query = '';

    if(filterIds === ''){
        query = 'SELECT * FROM images';
    }else{
        query = 'SELECT DISTINCT i.* FROM images i INNER JOIN tagged t ON i.id=t.imageId AND t.tagId in(' + filterIds + ')';
    }
    
    connection.fetchAll(query,createDatabaseElements);
}

function updateFilter(activeFilters,tag,id){
    tag = tag.replace('#', '');
    let tagLabel = `<label tag-id="${id}" name="tag" class="tag">#${tag}</label>`;
    activeFilters.insertAdjacentHTML("beforeend", tagLabel);
    activeFilters.querySelectorAll('label:last-child')[0].addEventListener('click',function(){
        this.parentNode.removeChild(this);
        reloadImages(activeFilters);
    });
}