    
    ,-.----.       ,----..
    \    /  \     /   /   \   .--.--.             .--.--.                         ____              ,--,
    |   :    \   /   .     : /  /    '.          /  /    '.                     ,'  , `.,-.----.  ,--.'|
    |   |  .\ : .   /   ;.  \  :  /`. /         |  :  /`. /                  ,-+-,.' _ |\    /  \ |  | :
    .   :  |: |.   ;   /  ` ;  |  |--`          ;  |  |--`                ,-+-. ;   , |||   :    |:  : '
    |   |   \ :;   |  ; \ ; |  :  ;_            |  :  ;_      ,--.--.    ,--.'|'   |  |||   | .\ :|  ' |      ,---.
    |   : .   /|   :  | ; | '\  \    `.          \  \    `.  /       \  |   |  ,', |  |,.   : |: |'  | |     /     \
    ;   | |`-' .   |  ' ' ' : `----.   \          `----.   \.--.  .-. | |   | /  | |--' |   |  \ :|  | :    /    /  |
    |   | ;    '   ;  \; /  | __ \  \  |          __ \  \  | \__\/: . . |   : |  | ,    |   : .  |'  : |__ .    ' / |
    :   ' |     \   \  ',  / /  /`--'  /         /  /`--'  / ," .--.; | |   : |  |/     :     |`-'|  | '.'|'   ;   /|
    :   : :      ;   :    / '--'.     /         '--'.     / /  /  ,.  | |   | |`-'      :   : :   ;  :    ;'   |  / |
    |   | :       \   \ .'    `--'---'            `--'---' ;  :   .'   \|   ;/          |   | :   |  ,   / |   :    |
    `---'.|        `---`                                   |  ,     .-./'---'           `---'.|    ---`-'   \   \  /
      `---`                                                 `--`---'                      `---`              `----'


Overview
--------

This is a sample restaurant ordering/point-of-sale system, written in Angular with a Spring REST backend.
Bootstrap adds some UI styling and Flexbox (CSS3) is used for most of the layout. 

Installation
------------

1)  Install MySQL 5.6.5 or later (due to http://stackoverflow.com/a/10603198/132374).
2)  Execute the database.sql DDL to set up the tables
3)  You can change the DB connection details in `com.reonsoftware.possample.Application`   
4)  Spring Boot is used as the server, and the main class is `com.reonsoftware.possample.Application`.
    Start the server and browse to index.html.  Use the CSV import feature to import the contents of items.csv
    (in this folder) into the items table.

Also:

 - Flexbox was used for UI layout, so please view the site using a modern browser 
 - The project was created using IntelliJ and Maven

Notes
-----
   
In a real web app, things would be a bit different:   

 - I enjoy TDD & BDD, but haven't set up Java/Javascript unit tests for this sample yet
 - The JS isn't checking for failed AJAX calls or other errors
 - It'd be nice to make use of Angular directives (maybe make menu items into a reusable directive/tag)
 - NPM was used to pull in dependencies like Angular.  Typically I'd exclude the node_modules folder from source
   control, but in this case I'm including it so that you don't have to install Node on your system.
   
Screenshots
-----------
   
![Order entry](/docs/screenshot_order_entry.PNG?raw=true "Order entry")

![Payment dialog](/docs/screenshot_payment.PNG?raw=true "Payment dialog")

![List of orders](/docs/screenshot_payment.PNG?raw=true "List of orders")