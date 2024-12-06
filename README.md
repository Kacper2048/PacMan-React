
![alt text](https://raw.githubusercontent.com/Kacper2048/PacMan-React/refs/heads/master/mainBoard.png)


## About ☝🤓

This project is a browser-based implementation of the classic Pac-Man game, built using React.js for modular, reusable components and dynamic state management. The game features a grid-based map, interactive gameplay, and real-time updates for character movements and interactions.

**Key functionalities include**

- 🗺 **Player-controlled Pac-Man navigating the grid.** 🗺
- 👻 **BFS-driven  ghosts** 👻
- 🏆 **Score tracking for pellets eaten and bonuses collected.** 🏆
- 🙏 **Responsive design, ensuring smooth play on different devices** (Provided that we play at 1920x1080)🙏

The project showcases skills in React state management, component design, and real-time logic handling, making it a fun and educational experience.

## How to Run the Project 🚀

- Clone the Repository (https example)
    ```bash
    git clone https://github.com/Kacper2048/PacMan-React.git
    cd <project-folder>
    
- Install Dependencies( Ensure you have Node.js installed) then run:
    
    ```bash
    npm install

- Launch the app in your browser with:
    
    ```bash
    npm start
    

- Open in Browser

    Visit http://localhost:3000 to play the game! 🎮

## 🛠️ **Create Your Own Map!** 🎉

Take control and design your own Pac-Man map with ease!  
In the `/src/BoardComponent` directory, you'll find the `BoardGenerator.jsx` file.  

### Steps to Customize:

1. **Replace the Board Component:**  
   In `App.js`, swap `<Board>` with `<BoardGenerator>`.

2. **Design Your Map:**  
   Use the intuitive interface to create your personalized Pac-Man layout.  

3. **Export Your Map:**  
   Click the **"Return Array"** button and check your browser's console log.

4. **Integrate Your Creation:**  
   Copy the printed array and paste it into `/src/BoardComponent/Board.jsx` like this:  
   ```javascript
   let board = useRef(<paste your array here>);

![alt text](https://raw.githubusercontent.com/Kacper2048/PacMan-React/refs/heads/master/mapGenerator.png)
