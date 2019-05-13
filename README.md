# Play-Set

Copyright (c) 2019 Allison Wong

This will be an ASP.NET Core application based on the card game Set.  

## Current Features

This is a work in progress and at this point, only a single-player version is implemented.  Game logic follows the [official rules of Set](https://www.setgame.com/file/set-english) with the exception of points and penalty points since there is only single-player mode.  I am using C# for the back-end server with SQLite and Javascript for the front-end.  

### Updates

- (5/12) Timed mode with high scores is nearly finished 

## Future Plans

- Seed mode to practice/share game configurations
- Continuous integration
- Two-player version
- React

## Build Instructions

Windows (Visual Studio 2019, PowerShell):

- Clone the repository: `git clone https://github.com/wonal/play-set.git`
- Open PowerShell and navigate to the `play-set/Set.Api` directory
- Create the database schema: `dotnet ef database update`
- Open the project in Visual Studio.
- Press `F5` to build and run the project.


Windows (PowerShell only):
- Clone the repository: `git clone https://github.com/wonal/play-set.git`
- Navigate to the Set.Api directory: `cd Set.Api`
- Create the database schema: `dotnet ef database update`
- Run the project: `dotnet run`
- Open a browser window and navigate to `http://localhost:5000`











