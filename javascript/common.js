//  These functions are used on more than one page in the application.

function configureElement (elementType, object, parent)
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