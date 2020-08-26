console.log ("IndexedDB.js");

let db = undefined;     //  a reference to the database

const request = indexedDB.open ("shopping.list", 1);
request.onerror = event =>
{   console.log ("failure to launch");
}

request.onsuccess = event =>
{   db = event.target.result;

    const transaction = db.transaction ("all-products");
    const objectStore = transaction.objectStore ("all-products")
    const index = objectStore.index ("by-location-product")

    let count = 0;
    let locationcount = 0;
    let lastlocation = undefined;
    let section = undefined;

    const main = document.getElementById ("main");

    index.openCursor().onsuccess = (event =>
    {   let cursor = event.target.result;

        if (cursor)
        {
            ++count;

            if (cursor.value.location != lastlocation)
            {   lastlocation = cursor.value.location
                locationcount = 0;

                section = document.createElement ("section");
                main.append (section);

                configureElement ("div",
                    {   "class": "heading",
                        "innerText": cursor.value.location.toUpperCase() + " ▼",
                        "onclick": "console.log ('heading clicked');"
                    },
                    section);
            }

            buildPage (section, cursor, ((++locationcount % 2) == 0));
            cursor.continue ();
        }
    })
}
