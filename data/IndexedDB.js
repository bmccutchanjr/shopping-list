console.log ("IndexedDB.js");

let db = undefined;     //  a reference to the database

function getDbReference ()
{   //  Open the database and set a global variable to reference the database object throughout
    //  the application.

    //  This code does not have to be implemented as a function.  Nothing about it screams function;
    //  -   It will work just fine without being enclosed in a function.  In fact, when I first
    //      wrote it it was not.
    //  -   This code is used exactly once.  It will be referenced nowhere else in this application.
    //
    //  But without wrapping the code in a function, every variable declared here will be a
    //  global variable and exist throughout the application.  The only variable declared here that
    //  needs a reference elsewhere is 'db'.  Everything else is only required to get 'db'.
    //
    //  The function allows JavaScript to do some housecleaning and remove those extraneous
    //  references.
    
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

                    section = configureElement ("section",
                        {   "expanded": "false",
                        },
                        main);

                    configureElement ("div",
                        {   "class": "heading",
                            "innerText": cursor.value.location.toUpperCase() + " ▼",
                            "onclick": "expandSection (event);"
                        },
                        section);
                }

                buildPage (section, cursor, ((++locationcount % 2) == 0));
                cursor.continue ();
            }
        })
    }
}

getDbReference ();
