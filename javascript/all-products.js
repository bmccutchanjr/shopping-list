//  There are several (perhaps hundreds of) product <div> on the page, and each has an "edit" and
//  a "delete" option.  Although a user probably wouldn't, theoretically several (even all of them)
//  could be clicked.
//
//  I want to disable the "edit" and "delete" options if either is active.

let deleteActive = false;
let formActive = false;

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

//  Collects the functions used to display and implement the 'confirm delete' dialog.

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

    deleteActive = false;
}

function confirmDelete (element)
{
    if (deleteActive) return;
    if (formActive) return;

    deleteActive = true;

    const parent = element.parentNode;
    const uniqueID = parent.getAttribute ("uniqueID");

    const name = parent.firstChild.innerText;

    const modal = configureElement ("div",
        {   "class": "modal",
            "id": "modal",
            "top": window.pageYOffset + 50 + "px",
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
            "onclick": "event.preventDefault();deleteProduct (" + uniqueID + ")",
            "innerText": "DELETE"
        },
        bdiv);

    configureElement ("a",
        {   "class": "modal-option",
            "href": "#",
            "onclick": "event.preventDefault();hideMessage ()",
            "innerText": "CANCEL"
        },
        bdiv);
}

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

//  Collect the functions used to display and interact with the <form>

function formCancel (event)
{   //  The event handler for the <form> cancel option

    event.preventDefault();

    form.style.display = "none";

    form["prod-name"].value = undefined;
    form["hide-name"].value = undefined;

    form["prod-loc"].value = undefined;
    form["hide-loc"].value = undefined;

    form["plan-qty"].value = undefined;
    form["hide-qty"].value = undefined;

    form["plan-price"].value = undefined;
    form["hide-price"].value = undefined;

    form["prod-desc"].value = undefined;
    form["hide-desc"].value = undefined;

    form["hide-uID"].value = undefined;

    formActive = false;
}

function formDisplay ()
{   form.style.display = "block";
    form.style.top = window.pageYOffset + 50 + "px";
}

function formReset ()
{   //  The event handler for the <form> reset option

    event.preventDefault();
    
    form["prod-name"].value = form["hide-name"].value;
    form["prod-loc"].value = form["hide-loc"].value;
    form["plan-qty"].value = form["hide-qty"].value;
    form["plan-price"].value = form["hide-price"].value;
    form["prod-desc"].value = form["hide-desc"].value;
}

function formSave (event)
{   //  The event handler for the <form> save option

    event.preventDefault ();
    
    const objectStore = db.transaction (["all-products"], "readwrite")
                          .objectStore ("all-products")
    const r1 = objectStore.get (Number (form["hide-uID"].value));
    r1.onsuccess = event =>
    {   let data = event.target.result;

        data.product = form["prod-name"].value;
        data.location = form["prod-loc"].value;
        data.description = form["prod-desc"].value;
        data.plan.quantity = Math.floor(form["plan-qty"].value);
        data.plan.cost = Math.floor(form["plan-price"].value * 100);
//  01  Do I even need this?
//  01          if (form["hide-uID"].value != "")
//  01              data.uniqueID = form["hide-uID"].value

        const r2 = objectStore.put (data);
        r2.onsuccess = event =>
        {   form.style.display = "none";
            formActive = false;
        }
    }
}

function changeProduct (uniqueID)
{   //  The event handler for the edit option of each product <div>

    if (formActive) return;
    if (deleteActive) return;

    //  Signal that the <form> is now activated

    formActive = true;

    let data = {};

    const transaction = db.transaction (["all-products"]);
    const objectStore = transaction.objectStore ("all-products");
    const request = objectStore.get (uniqueID);
    request.onerror = event =>
    {
        alert ("error reading the database");
    }

    request.onsuccess = event =>
    {
        data = event.target.result;

        form["prod-name"].value = data.product;
        form["hide-name"].value = data.product;

        form["prod-loc"].value = data.location;
        form["hide-loc"].value = data.location;

        form["plan-qty"].value = data.plan.quantity;
        form["hide-qty"].value = data.plan.quantity;

        form["plan-price"].value = formatDollars (data.plan.cost);
        form["hide-price"].value = formatDollars (data.plan.cost);

        form["prod-desc"].value = data.description;
        form["hide-desc"].value = data.description;

        form["hide-uID"].value = uniqueID;

        formDisplay ();
    }
}

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

//  Collects the functions used to create and populate <div> elements for each product in the
//  database.  These functions are only called when the page is first loaded (or refreshed).

function makeProductDiv (section, data, even)
{   //  Creates a <div> element that will be appended to the <section> element referenced by parameter
    //  'section'

    const parentDiv = configureElement ("div", 
        {   "class": "product " + (even ? "even" : "odd"),
            "id": "id-" + data.uniqueID,
            "uniqueID": data.uniqueID
        },
        section);

    let classlist = "field name pending";
    if (data.status == "in the cart") classlist.replace ("pending", "in-cart:");
    if (data.status == "on the list") classlist.replace ("pending", "on-list:");

    configureElement ("div",
        {   "class": classlist,
            "id": "pr-" + data.uniqueID,
            "innerText": data.product
        },
        parentDiv);

    configureElement ("div",
        {   "class": "field label quantity",
            "innerText": "quantity:"
        },
        parentDiv);

    configureElement ("input",
        {   "class": "input quantity",
            "placeholder": "1",
            "readonly": true,
            "value": data.plan.quantity
        },
        parentDiv);

    configureElement ("div",
        {   "class": "field label price",
            "innerText": "price:"
        },
        parentDiv);

    configureElement ("input",
        {   "class": "input price",
            "placeholder": "1.00",
            "readonly": true,
            "value": formatDollars (data.plan.cost)
        },
        parentDiv);

    configureElement ("a",
        {   "class": "modal-option",
            "href": "#",
            "innerText": "EDIT",
            "onclick": "event.preventDefault();changeProduct (" + data.uniqueID + ")"
        },
        parentDiv);

    configureElement ("a",
        {   "class": "prod-button delete",
            "href": "#",
            "innerText": "X",
            "onclick": "event.preventDefault();confirmDelete (this)"
        },
        parentDiv);
}

function buildPage (section, cursor, even)
{   //  Page specific code to build the page.

        makeProductDiv (section, cursor.value, even);
}