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

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

//  Collects the functions used expand/collapse the location <section>.

//  06  function expandSection (event)
//  06  {   //  The event handler for <section> onclick events
//  06  
//  06      let header = event.target;
//  06  
//  06      //  The event is actually triggered on a child of the <section>, so event.target does not
//  06      //  reference the <section> element that I want.  That element is the parent of the event
//  06      //  target...
//  06  
//  06      let section = header.parentNode;
//  06      let expanded = section.getAttribute ("expanded") == "true";
//  06  
//  06      let products = section.getElementsByClassName ("product");
//  06      const length = products.length;
//  06      for (let x=0; x<length; x++)
//  06      {   //  Set the CSS display property of each child of the <section>
//  06  
//  06          products[x].style.display = expanded ? "none" : "flex";
//  06      }
//  06  
//  06      if (expanded)
//  06      {   //  If the <section> was expanded when this event was triggered, it is now collapsed
//  06  
//  06          section.setAttribute ("expanded", "false");
//  06          header.innerText = header.innerText.replace ("▲", "▼")
//  06      }
//  06      else
//  06      {   section.setAttribute ("expanded", "true");
//  06          header.innerText = header.innerText.replace ("▼", "▲")
//  06      }
//  06  }
//  06  begins
function expandIt (section, header, expanded)
{   //  The does the actual work of expanding/collapsing one <section> element.  This function is
    //  called from expandAll() and expandSection().

//  07      if (expanded == undefined)
//  07          expanded = section.getAttribute ("expanded") == "true";

    let products = section.getElementsByClassName ("product");
    const length = products.length;
    for (let x=0; x<length; x++)
    {   //  Set the CSS display property of each child of the <section>

        products[x].style.display = expanded ? "none" : "flex";
    }

    if (expanded)
    {   //  If the <section> was expanded when this event was triggered, it is now collapsed

        section.setAttribute ("expanded", "false");
        header.innerText = header.innerText.replace ("▲", "▼")
    }
    else
    {   section.setAttribute ("expanded", "true");
        header.innerText = header.innerText.replace ("▼", "▲")
    }
}

function expandAll (event)
{   //  The event handler for the expand/collapse option in the <menu>

    let option = event.target;
    let expanded = option.getAttribute ("expanded") == "true";

    let main = document.getElementById ("main");
    let sections = main.getElementsByTagName ("section");
    let length = sections.length;
    for (let x=0; x<length; x++)
    {
        let children = section.getElementsByClassName ("header");
        expandIt (sections[x], children[0], expanded);
    }

    if (expanded)
        option.setAttribute ("expanded", "false");
    else
        option.setAttribute ("expanded", "true");
}

function expandSection (event)
{   //  The event handler for <section> onclick events

    let header = event.target;

    //  The event is actually triggered on a child of the <section>, so event.target does not
    //  reference the <section> element that I want.  That element is the parent of the event
    //  target...

    let section = header.parentNode;
    let expanded = section.getAttribute ("expanded") == "true";
    expandIt (section, header, expanded);
}
//  06  ends