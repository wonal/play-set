# Play-Set

Copyright (c) 2019 Allison Wong

This will be an ASP.NET Core application based on the card game Set.  Game logic follows the [official rules of Set](https://www.setgame.com/file/set-english) with the exception of points and penalty points since there is currently only single-player mode.

## Current Features

This is a work in progress and at this point, only a single-player version is implemented along with the following features:
- Timed mode, where players can see how long it takes for them to complete the game
- Seed mode, where a game can be created from a seed, allowing a player to practice or share a game configuration
- High scores, available with Timed mode, displaying the top five fastest times
- A visual history of the sets made during the game

## Future Plans

- Continuous integration
- Two-player version
- React

## Build Instructions

- Clone the repository: `git clone https://github.com/wonal/play-set.git`
- Navigate to the Set.Api directory: `cd Set.Api`
- Create the database schema: `dotnet ef database update`
- Run the project: `dotnet run`
- Open a browser window and navigate to `http://localhost:5000`












