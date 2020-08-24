//  These functions are used on more than one page in the application.

function configureElement (elementType, object, parent = undefined)
{   //  A generic function to configure HTML elements in the DOM.  There are half a dozen HTML
    //  elements on each line of the list and each needs to be configured and elements need to
    //  be added to the screen when the page is first loaded and when a new item is added to the
    //  shopping list.  Most of the code to do it is the same for each and every element...
    //
    //  Thus this function.  Write the code one time...
    //
    //  'parent' is an optional parameter.  If passed it is some DOM element that the newly created
    //  element will appended to.

    //  First thing is to create the new HTML element...
    let element = document.createElement (elementType);

    //  And apply formatting...
    let keys = Object.entries (object);
    keys.forEach (attribute =>
    {   switch (attribute[0])
        {   case "innerText":
            {   element.innerText = attribute[1];
                break;
            }
            case "innerHTML":
            {   element.innerHTML = attribute[1];
                break;
            }
            default:
            {   element.setAttribute (attribute[0], attribute[1]);
                break;
            }
        }
    })

    //  And finally append it to it's parent
    if (parent)
        parent.append (element);

    return element;
}

function displayMessage (message)
{   //  Configure and display the message modal
    //
    //  In an attempt to make this function as generic as possible, the modal (including buttons) is
    //  built from scratch.

    const section = document.getElementById ("message");
    while (section.hasChildNodes ())
    {   section.removeChile (section.firstChild)
    }

    const array = message.entries ();
    array.forEach (a =>
    {   switch (a[0])
        {
            case ("button"):
            {   const buttons = section.getElementsByClassName ("button-bar");

                const div = buttons.entries ();
                div.forEach (b =>
                {
                    configureElement ("a",
                        {
                           "class": b.class,
                           "onclick": b.onclick 
                        },
                        d);
                })

                break;
            }
            case "class":
            {
                section.setAttribute ("class", section.setAttribute ("class") + a[1]);
                break;
            }
            case "message":
            {
                section.innerText = a[1];
                break;
            }
            default:
            {   //  Not sure there is a default function
                break;
            }
        }

    })
}

function hideMessage ()
{   //  A generic function to "hide" the modal window that messages are displayed in.  'hide' is a
    //  euphamism for remove the element from the DOM, which both removes it from the screen and
    //  removes any content that might be in it.

    document.body.removeChild (document.getElementById ("modal"));
}

function deleteProduct (uniqueID)
{   //  Remove the selected <div> element from the screen and then delete the record it represents
    //  from the database.

    const product = document.getElementById ("id-" + uniqueID);
    product.parentElement.removeChild (product);

//  and now delete the item from the database...

    const transaction = db.transaction ("all-products", "readwrite");
    const objectStore = transaction.objectStore ("all-products");
    objectStore.delete (uniqueID);
    transaction.onerror = event =>
        {
            //  Display an error...but just alert for now...
            alert ("An error occured...");
        };
    transaction.onsuccess = event =>
        {
            //  This is all good...nothing to do...
        };

//  when this <div> is removed, the background colors of the remaining <div> will no longer alternate,
//  because that is a consequence of the class of the siblengs and they are unaffected by removing this
//  <div>.  So maybe iterate through the children of the parent <section> to reassign class?

    //  Last things last...remove the modal window
    hideMessage ();
}

function confirmDelete (element)
{
    const parent = element.parentNode;
    const uniqueID = parent.getAttribute ("uniqueID");

    const name = parent.firstChild.innerText;

    const modal = configureElement ("div",
        {   "class": "modal",
            "id": "modal"
        },
        document.body);

    const tdiv = configureElement ("div",
        {   "class": "modal-text",
            "innerHTML": "You have chosen to permanently delete item: " +
                    "<b>" + name + "</b> from the database.<br><br>" +
                    "Are you sure?"
        },
        modal);
    
    const bdiv = configureElement ("div",
        {   "class": "modal-buttons"
        },
        modal);

    configureElement ("a",
        {   "class": "modal-option",
            "href": "#",
            "onclick": "deleteProduct (" + uniqueID + ")",
            "innerText": "DELETE"
        },
        bdiv);

    configureElement ("a",
        {   "class": "modal-option",
            "href": "#",
            "onclick": "hideMessage ()",
            "innerText": "CANCEL"
        },
        bdiv);
}

function formatDollars (number)
{   return (number / 100).toFixed (2)
}

function errorMessage (message)
{   //  Use configureElement() to place the message on the screen.
    configureElement ("div",
        {   "class": "message error",
            "innerText": message
        },
        document.getElementById ("main"));
}

function workingMessage ()
{   //  Why display an empty screen for the time it takes to open and read the database?  Use
    //  configureElement() to let the user know the application is working.

    configureElement ("div",
        {   "class": "message",
            "innerText": "No data yet.  Waiting on the database."
        },
        document.getElementById ("main"));
}