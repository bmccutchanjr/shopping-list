//  There are several (perhaps hundreds of) product <div> on the page, and each has a"delete" option.
//  Although a user probably wouldn't, theoretically several (even all of them) could be clicked.
//
//  I want to disable the "delete" options if either is active.

let removeActive = false;

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

//  Collects the functions used to display and implement the 'confirm delete' dialog.

function removeProduct (uniqueID)
{   //  Remove the selected <div> element from the screen and then modify the database to
    //  indicate this product is no longer on the shopping list.  This function DOES NOT
    //  delete the product from the database.

    const product = document.getElementById ("id-" + uniqueID);

    const oStore = db.transaction (["all-products"], "readwrite")
                          .objectStore ("all-products");
    const r1 = oStore.get (uniqueID);
    r1.onerror = event =>
    {
        alert ("AN ERROR:\n\n" + event.target.result);
    }

    r1.onsuccess = event =>
    {   let data = event.target.result;

        data.status = "pending";

        const r2 = oStore.put (data);
        r2.onerror = event =>
        {
            alert ("AN ERROR:\n\n" + event.target.result);
        }

        r2.onsuccess = event =>
        {   //  The database transaction is complete...remove the product DOM element from the
            //  page

            product.parentElement.removeChild (product);
//  when this <div> is removed, the background colors of the remaining <div> will no longer alternate,
//  because that is a consequence of the class of the siblengs and they are unaffected by removing this
//  <div>.  So maybe iterate through the children of the parent <section> to reassign class?
            hideMessage ();
            removeActive = false;
        }
    }
}

function confirmRemove (event)
{
    if (removeActive) return;

    removeActive = true;

    const option = event.target;
    const product = option.parentNode;
    const uniqueId = product.getAttribute ("uniqueId");
    const name = product.firstChild.innerText;

    const modal = configureElement ("div",
        {   "class": "modal",
            "id": "modal",
            "top": window.pageYOffset + 50 + "px",
        },
        document.body);

    const tdiv = configureElement ("div",
        {   "class": "modal-text",
            "innerHTML": "You have chosen to remove item: " +
                    "<b>" + name + "</b> from the shopping list.  This action does not delete " +
                    "the selected product from the database.<br><br>" +
                    "Are you sure?"
        },
        modal);
    
    const bdiv = configureElement ("div",
        {   "class": "modal-buttons"
        },
        modal);

    configureElement ("a",
        {   "class": "option modal-option",
            "href": "#",
            "onclick": "removeProduct (" + uniqueId + ")",
            "innerText": "REMOVE"
        },
        bdiv);

    configureElement ("a",
        {   "class": "option modal-option",
            "href": "#",
            "onclick": "hideMessage ()",
            "innerText": "CANCEL"
        },
        bdiv);
}

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

//  Collects the functions used to create and populate <div> elements for each product in the
//  database.  These functions are only called when the page is first loaded (or refreshed).

function makeProductDiv (section, data, even)
{   //  Creates a <div> element that will be appended to the <section> element referenced by parameter
    //  'section'

    const parent = configureElement ("div", 
        {   "class": "product " + (even ? "even" : "odd"),
            "id": "id-" + data.uniqueID,
            "uniqueId": data.uniqueID
        },
        section);

    let classlist = "field name needed";
    status = "needed";

    if ((data.status == "in the cart") || (data.status == "on the list"))
    {   classlist = classlist.replace ("pending", "needed");
        ++countOnList;
        status = "needed";
    }

    configureElement ("a",
        {   "class": classlist,
            "href": "#",
            "innerText": data.product,
            "onclick": "toggleListStatus (event);",
            "status" : status,
            "uniqueId": data.uniqueID
        },
        parent);

    configureElement ("div",
        {   "class": "field label quantity",
            "innerText": "quantity:"
        },
        parent);

    configureElement ("input",
        {   "class": "input quantity",
            "placeholder": "1",
            "readonly": true,
            "value": data.plan.quantity
        },
        parent);

    configureElement ("div",
        {   "class": "field label price",
            "innerText": "price:"
        },
        parent);

    configureElement ("input",
        {   "class": "input price",
            "placeholder": "1.00",
            "readonly": true,
            "value": formatDollars (data.plan.cost)
        },
        parent);

    configureElement ("a",
        {   "class": "option delete",
            "href": "#",
            "innerText": "X",
            "onclick": "confirmRemove (event)"
        },
        parent);
}

function buildPage (data)
{   //  Page specific code to build the page.

    const main = document.getElementById ("main");

    const status = data.status;
    if ((status == undefined) || (status == "") || (status == "pending"))
        return;

    if (data.location != lastlocation)
    {   lastlocation = data.location
        locationcount = 0;
        ++countLocations

        section = configureElement ("section",
        {   "expanded": "false",
        },
        main);

        configureElement ("div",
        {   "class": "heading",
            "innerText": data.location.toUpperCase() + " ▼",
            "onclick": "expandSection (event);"
        },
        section);
    }

    ++count;

    makeProductDiv (section, data, ((++locationcount % 2) == 0));

    const quantity = data.plan.quantity;
    const price = data.plan.quantity * data.plan.price;
    countProducts += quantity;
    dollarsOnList += quantity * price;
}

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

function summaryStats ()
{   //  Display summary data from page load; how many products were found, how many are already
    //  on the shopping list, how many locations were found.

//     const modal = configureElement ("div",
//         {   "class": "modal",
//             "id": "modal",
//             "top": window.pageYOffset + 50 + "px",
//         },
//         document.body);
//
//     const tdiv = configureElement ("div",
//         {   "class": "modal-text",
//             "innerHTML": countProducts + " products were found in " + countLocations + " locations.<br><br>"
//                        + countOnList + " items are on the shopping list.  Total cost: $0.00"
//         },
//         modal);
// 
//     const bdiv = configureElement ("div",
//         {   "class": "modal-buttons"
//         },
//         modal);
//
//     configureElement ("a",
//         {   "class": "option modal-option",
//             "href": "#",
//             "onclick": "hideMessage (event);",
//             "innerText": "OK",
//         },
//         bdiv);
    alert ("summary");
}
