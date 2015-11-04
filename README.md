    
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
It uses Spring Boot, so to run it, the main class is `com.reonsoftware.possample.Application`.

Installation
------------

 - The database used is MySQL, and the DDL is in database.sql in this directory
   I'm afraid MySQL 5.6.5 or later is required, due to http://stackoverflow.com/a/10603198/132374.
 - The database name is 'pos', with a user 'pos' with password 'pos'.  These details are hard-coded 
   in com.reonsoftware.possample.Application for now.
 - The project was created using IntelliJ and Maven

Notes
-----

 - I enjoy TDD & BDD, but haven't set up Java/Javascript unit tests for this sample yet
 - The JS isn't checking for failed AJAX calls or other errors
 - Flexbox was used for UI layout, so please view the site using a modern browser
 - NPM was used to pull in dependencies like Angular.  Typically I'd exclude the node_modules folder from source
   control, but in this case I'm including it so that you don't have to install Node on your system.