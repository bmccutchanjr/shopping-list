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
            // "innerText": "quantity:",
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
            // "innerText": "price:",
            "placeholder": "1.00",
            "readonly": true,
            "value": formatDollars (data.plan.cost)
        },
        parentDiv);

    configureElement ("button",
        {   "class": "prod-button edit",
            "innerText": "EDIT"
        },
        parentDiv);

    configureElement ("button",
        {   "class": "prod-button delete",
            "innerText": "DEL"
        },
        parentDiv);
}

function buildPage (section, cursor, even)
{   //  Page specific code to build the page.

        makeProductDiv (section, cursor.value, even);
}