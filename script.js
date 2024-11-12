const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bkmarkForm = document.getElementById('bkmark-form');
const websiteName = document.getElementById('website-name');
const websiteURL = document.getElementById('website-url');
const bkmarksContainer = document.getElementById('bkmarks-container');

let bookmarks = [];

// SHOW MODAL & FOCUS ON INPUT
function showModal(){
    modal.classList.add('show-modal');
    websiteName.focus();
}

// MODAL EVENT LISTENERS
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click', (e) => (e.target === modal ? modal.classList.remove('show-modal') : false));

// VALIDATE FORM
function validate(nameValue, urlValue) {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if(!nameValue || !urlValue) {
        alert('YOU NEED TO FILL IN BOTH FIELDS');
        return false;
    }
    if(!urlValue.match(regex)) {
        alert('PLEASE ENTER A VALID WEB ADDRESS');
        return false;
    }
    // VALID
    return true;
} 

// BUILD BOOKMARKS DOM
function buildBkmarks(){
    // REMOVE ALL BOOKMARKS
    bkmarksContainer.textContent = '';
    // BUILD ITEMS
    bookmarks.forEach((bookmark) => {
        const {name, url} = bookmark;
        // ITEM
        const item = document.createElement('div');
        item.classList.add('item');
        // CLOSE ICON
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fa-solid','fa-xmark');
        closeIcon.setAttribute('title', 'Delete Bookmark');
        closeIcon.setAttribute('onclick', `deleteBkmark('${url}')`);
        // FAVICON & LINK CONTAINER
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        // FAVICON
        const favicon = document.createElement('img');
        // The link https://s2.googleusercontent.com/s2/favicons?domain= is used by Google 
        // to retrieve favicons for specific domains.It's a service provided by Google 
        // that dynamically fetches the favicon for any domain by appending the domain name to the URL.
        favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
        favicon.setAttribute('alt', 'star.png');
        // LINK
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;
        // APPEND/ADD TO BOOKMARKS CONTAINER
        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bkmarksContainer.appendChild(item);
    });
}

// FETCH BOOKMARKS
function fetchBkmarks(){
    // GET BOOKMARKS FROM LOCALSTORAGE IF AVAILABLE
    if (localStorage.getItem('BOOKMARKS')){
        bookmarks = JSON.parse(localStorage.getItem('BOOKMARKS'));
    }
    else {
        // CREATE BOOKMARKS ARRAY IN LOCALSTORAGE
        bookmarks = [
            {
                name: 'Google',
                url: 'https://www.google.gr/?gfe_rd=cr&ei=bQTUWJ_VBsLb8Ae90onADg',
            },
        ];
        localStorage.setItem('BOOKMARKS',JSON.stringify(bookmarks));
    }
    buildBkmarks();

}

// DELETE BOOKMARK
// REMOVES OR REPLACES ELEMENTS AND ADD NEW ELEMENTS INSTEAD
function deleteBkmark(url){
    bookmarks.forEach((bookmark, i) => {
        if(bookmark.url === url) {
            bookmarks.splice(i, 1); //REMOVE THE BOOKMARK AT INDEX i
        }
    });
    // UPDATE BOOKMARKS ARRAY IN LOCALSTORAGE & REPOPULATE DOM
    localStorage.setItem('BOOKMARKS', JSON.stringify(bookmarks));
    fetchBkmarks(); //REBUILD THE BOOKMARK LIST ON THE DOM
}

// HANDLE DATA FROM THE FORM
function storeBkmark(e){
    e.preventDefault();
    //console.log(e);
    const nameValue = websiteName.value;
    let urlValue = websiteURL.value;
    if(!urlValue.includes('https://') && !urlValue.includes('http://')) {
        urlValue = `https://${urlValue}`;
    }

    if(!validate(nameValue, urlValue)) {
        return false;
    }
    // CREATING A bookmark OBJECT
    const bookmark = {
        name: nameValue,
        url: urlValue,
    };
    bookmarks.push(bookmark);
    
    localStorage.setItem('BOOKMARKS',JSON.stringify(bookmarks));
    fetchBkmarks();
    bkmarkForm.reset();
    websiteName.focus();
}

// EVENT LISTENER
bkmarkForm.addEventListener('submit', storeBkmark);
// ON LOAD, FETCH BOOKMARKS
fetchBkmarks();
