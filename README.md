# Classic Quiz Engine

### Project Overview
Simple Quiz Engine is a practice project designed as a quiz system for a larger website. This web application allows users to take quizzes with multiple-choice questions, providing a dynamic way to assess knowledge in various subjects. The project serves as an excellent showcase of a minimalistic quiz engine developed using TypeScript and JavaScript without external frameworks.

### Technologies Used
- TypeScript: All logic and component structure is initially coded in TypeScript, offering robust typing and better structuring capabilities.
- JavaScript: TypeScript is transpiled to JavaScript, ensuring compatibility across different browsers.
- Local Storage: Utilizes the browser's local storage to save quiz results and settings, allowing persistence of user data across sessions.
- No CSS: Focuses purely on functionality rather than style, with minimal or no styling involved.

### How It Works
The quiz starts with an introduction screen where users can begin their quiz journey. Upon starting, the application loads questions and answers from a JSON file, displaying them one at a time. Users navigate through questions using "Next" and "Previous" buttons, and they can finish the quiz only after answering all questions. The results are calculated based on correct answers and are displayed along with detailed statistics, including time spent on each question.

### Features:
- Shuffled Questions: Ensures questions are presented in a random order each time the quiz is started.
- Timers: Implements a quiz timer and a question timer to track the duration of the quiz and each question, respectively.
- Results Summary: At the end of the quiz, users are provided with a summary that includes the total score, time spent, and a detailed breakdown of each question and answer.
- Persistence: Results and quiz progress are stored in local storage, allowing users to leave and resume the quiz without losing their progress.

### Project Structure
- `index.html`
- `index.js`
- `index.ts`
- `package-lock.json`
- `package.json`
- `quiz.json`
- `styles.css`
- `tsconfig.json`
