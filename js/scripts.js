

function doLogin(e) {
    e.preventDefault();
    const userInputElement = document.getElementById('entryName');
    const passwordInputElement = document.getElementById('entryPassword');

    if(userInputElement.value === 'user1' && passwordInputElement.value === 'password123'){
        window.location.href = `${window.location.origin}/index.html`
    } else alert('Wrong username or password!\nYou may use "user1" as an username and "password123" as a password!')
}

let loader;

let entries;
let newTempEntry = {
    entry_name: '',
    entry_date: '',
    category_name: '',
    entry_completed: false,
};


function getAllEntries() {
    toggleLoader();
    fetch("https://todolist-9a51.restdb.io/rest/todolist", {
        method: "get",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "x-apikey": "5d8dcab41ce70f6379855087",
            "cache-control": "no-cache"
        }
    })
        .then(e => {
            e.json().then((data) => {
                if(data.length !== 0) {
                    toggleLoader();
                    data.forEach((entry) => {
                        addNewEntryToHTML(entry)
                    });
                }
            }).catch(e => console.log(e));
        })
        .catch(e => {
            console.log(e);
            entries = [];
        });
}

function postEntry(entry) {
    toggleLoader();
    const postData = JSON.stringify(entry);
    fetch("https://todolist-9a51.restdb.io/rest/todolist", {
        method: "post",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "x-apikey": "5d8dcab41ce70f6379855087",
            "cache-control": "no-cache"
        },
        body: postData
    })
        .then( (res) => {
            res.json()
                .then((data) => {
                    toggleLoader();
                    addNewEntryToHTML(data);
                }).catch(e => {
                console.log(e)
            });

        })
        .catch(e => console.log(e));
}

function updateEntryByID(entry) {
    toggleLoader();
    let postData = JSON.stringify(entry);

    fetch(`https://todolist-9a51.restdb.io/rest/todolist/${entry.entry_id}`, {
        method: "put",
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            "x-apikey": "5d8dcab41ce70f6379855087",
            "cache-control": "no-cache"
        },
        body: postData
    }).then(res => {
        res.json().then((response) => {
            toggleLoader();
        }).catch(e => console.log(e));
    }).catch(t => console.log(t));
}
const doLoadEntries = () => {
    loader = document.getElementById('loader');

    getAllEntries();

    const entryName = document.getElementById('entryName');
    const entryDate = document.getElementById('entryDate');
    const entryCategory = document.getElementById('entryCategory');
    // Submit button action
    document.getElementById('addEntry').onclick = (e) => {
        e.preventDefault();

        if(is.empty(newTempEntry.entry_name)) {
            return alert('Name is empty you fool!');
        }
        if(is.empty(newTempEntry.category_name)) {
            return alert('Please choose a category you fool!');
        }

        postEntry(newTempEntry);
    };

    entryName.onchange = function() {
        newTempEntry.entry_name = entryName.value;
    };

    entryDate.onchange = function() {
        const formatDate = function(date) {
            const splitedDate = date.split('-');

            return `${splitedDate[2]}/${splitedDate[1]}/${splitedDate[0]}`
        };

        newTempEntry.entry_date = formatDate(entryDate.value);
    };

    entryCategory.onchange = function() {
        newTempEntry.category_name = entryCategory.value;
    };


};

function addNewEntryToHTML(entry) {
    const entryTemplate = document.getElementById('entryTemplate');
    const newTempEntry = entryTemplate.content.cloneNode(true);
    const checkBox = newTempEntry.firstElementChild.children[1].children[0].children[1].firstElementChild.firstElementChild.firstElementChild.children;

    newTempEntry.firstElementChild.children[0].childNodes[1].children[0].textContent = entry.entry_name;
    newTempEntry.firstElementChild.children[0].childNodes[1].children[1].textContent = entry.entry_date;
    newTempEntry.firstElementChild.children[1].children[0].children[0].textContent = entry.category_name;
    checkBox[0].checked = entry.entry_completed;

    checkBox[0].id = entry['_id'];
    checkBox[1].setAttribute('for', entry['_id']);
    // checkBox.id = entry['_id'];

    checkBox[0].onchange = (event) => {
        event.preventDefault();

        markOrUnmarkEntry(checkBox[0]);
    };

    document.getElementById('entriesContainer').appendChild(newTempEntry);
}

function markOrUnmarkEntry(DOMElement) {
    updateEntryByID({
        entry_id: DOMElement.id,
        entry_completed: DOMElement.checked,
    });
}

function toggleLoader() {
    loader.classList.toggle('d-none');
}