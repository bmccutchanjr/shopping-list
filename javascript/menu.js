function expandThatMenu (event)
{
    event.preventDefault ();

    const option = event.target;
    const expanded = option.getAttribute ("expanded") == "true";

    //  The menu items are actually siblings of 'option'...so to iterate the menu items I need a
    //  reference to the <menu>.  That's option's parent.
    const menu = option.parentNode;
    const items = menu.children;
    const length = items.length;
    for (let x=1; x<length; x++)
    {
        items[x].style.display = expanded ? "none" : "inline-block";
    }

    if (expanded)
    {   option.innerText = option.innerText.replace ("▲", "▼");
        option.setAttribute ("expanded", "false");
    }
    else
    {   option.innerText = option.innerText.replace ("▼", "▲");
        option.setAttribute ("expanded", "true");
    }
}

function expandMenu (event)
{
    event.preventDefault ();

    expandThatMenu (event);

    setTimeout (() =>
    {
        expandThatMenu (event);
    },
    30000)
}

window.addEventListener ("load", event =>
{
    let header = document.getElementById ("header");

    let main = configureElement ("menu",
        {   "id": "menu"
        },
        header);

    configureElement ("a",
        {   "class": "option",
            "display": "inline-block",
            "expanded": false,
            "innerText": "▼ Options",
            "href": "#",
            "onclick": "expandMenu (event);"
        },
        menu);

    configureElement ("a",
        {   "class": "option",
            "display": "none",
            "innerText": "Shopping List",
            "href": "#",
//              "onclick": ""
        },
        menu);

    configureElement ("a",
        {   "class": "option",
            "display": "none",
            "expanded": false,
            "href": "#",
            "innerText": "Expand All",
            "onclick": "expandAll (event);"
        },
        menu);

    configureElement ("a",
        {   "class": "option",
            "display": "none",
            "href": "#",
            "innerText": "Summary Stats",
            "onclick": "summaryStats ();"
        },
        menu);
})
