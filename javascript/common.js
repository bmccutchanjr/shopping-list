//  These functions are used on more than one page in the application.

//
//  Utility functions that are used by multiple functions and processes throughout the application
//

function configureElement (elementType, object, parent = undefined)
{   //  A generic function to configure HTML elements in the DOM.  There are half a dozen HTML
    //  elements on each line of the list and each needs to be configured and elements need to
    //  be added to the screen when the page is first loaded and when a new item is added to the
    //  shopping list.  Most of the code to do it is the same for each and every element...
    //
    //  Thus this function.  Write the code one time...
    //
    //  'parent' is an optional parameter.  If passed it is some DOM element that the newly created
    //  element will be appended to.

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
            case "top":
            {   
                element.style.top = attribute[1];
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

function formatDollars (number)
{   return (number / 100).toFixed (2)
}

function hideMessage ()
{   //  A utility that "hides" the modal window used to display messages.  This function is called
    //  by several processes and functions throughout the application.
    // 
    //  Note that 'hide' is a euphamism for 'remove'.  The modal <div> will be removed from the DOM,
    //  which not only gets it off the screen but also removes any content (including child nodes)
    //  that might be in it.

    document.body.removeChild (document.getElementById ("modal"));

    deleteActive = false;
}

function noData ()
{   //  There is nothing in the database...prompt the user to add some...

    const modal = configureElement ("div",
        {   "class": "modal",
            "id": "modal",
            "top": "150px",
        },
        document.body);

    const tdiv = configureElement ("div",
        {   "class": "modal-text",
            "innerHTML": "There is nothing in the database.  Why not add some?"
        },
        modal);
    
    const bdiv = configureElement ("div",
        {   "class": "modal-buttons"
        },
        modal);

    configureElement ("a",
        {   "class": "modal-option",
            "href": "#",
            "onclick": "event.preventDefault();addProduct ()",
            "innerText": "ADD"
        },
        bdiv);
}

//  004 function errorMessage (message)
//  004 {   //  Use configureElement() to place the message on the screen.
//  004     configureElement ("div",
//  004         {   "class": "message error",
//  004             "innerText": message
//  004         },
//  004         document.getElementById ("main"));
//  004 }
//  004
//  004 function workingMessage ()
//  004 {   //  Why display an empty screen for the time it takes to open and read the database?  Use
//  004     //  configureElement() to let the user know the application is working.
//  004
//  004     configureElement ("div",
//  004         {   "class": "message",
//  004             "innerText": "No data yet.  Waiting on the database."
//  004         },
//  004         document.getElementById ("main"));
//  004 }