# Shopping List

Shopping List is just that, a simple shopping list that I wrote to assist in early design and development of an eventual mobile app.  Because Shopping List is intended to be used as if it were a stand-alone mobile app, it was written exclusively for the front-end using HTML, CSS and JavaScript.  The application is accessed with a web browser, but once loaded in the DOM it can be used off-line.

Shopping List uses the IndexedDB database manager built into modern web browsers for data storage and retrieval.

## Installing Shoppling List

There is no need to install the application.  [Simply clink on this link].

## About Shopping List

Shopping List consists of two pages:

            maintenance.html
            shopping.html

### maintenance.html

You'll use this page to add, remove and edit products from the master list.  This list is all of the items you would normally need to purchase from time to time.  But it is not the shopping list.

You'll also use maintenance.html to add items to and remove items from the shopping list.

### shopping.html

This is your shopping list.  It contains the items you've decided need to be purchased on your next trip to the store.  The list is sorted into store locations to make your trip a little more efficient...all of the items from the dairy section are grouped together so you won't loose track of one while in another section of the store.

That assumes the elements in your data store include the location information.

shopping.html also tracks the number of items and the total cost of the items you plan to purchase, as well as those items currently in your shopping cart.

## Using Shopping List

I think Shopping List is fairly intuitive, but a detailed description of the application can be found in USEME.md.