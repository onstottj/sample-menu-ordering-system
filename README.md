    
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

This is a sample AngularJS restaurant point-of-sale web app, with a REST backend written in Spring.  It uses Spring
Boot, so to run it, the main class is `com.reonsoftware.possample.Application`.

Installation
------------

 - The database used is MySQL, and the DDL is in database.sql in this directory
 - The database name is 'pos', with a user 'pos' with password 'pos'.  These details are hard-coded in
   com.reonsoftware.possample.Application for now.

Caveats
-------

 - Flexbox was used for UI layout, so please view the site using a modern browser
 - NPM was used to pull in dependencies like Angular.  Typically I'd exclude the node_modules folder from source
   control, but in this case I'm including it so that you don't have to install Node on your system.