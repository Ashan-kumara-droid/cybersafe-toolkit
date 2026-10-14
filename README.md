# CyberSafe Toolkit 🔐

A beginner-friendly cybersecurity awareness project built with **HTML, CSS, and vanilla JavaScript**.

## Features

- **Password hygiene checker:** gives simple suggestions for a made-up password. The password is checked in the browser only; it is not stored or transmitted.
- **Suspicious URL clue analyzer:** parses URL text and highlights a few patterns worth reviewing. It does not open or fetch the URL.
- **Security mini quiz:** four questions about phishing, passwords, HTTPS, and one-time codes.
- Responsive layout, accessible labels, and no build step or third-party JavaScript dependencies.

## Important limitations

This is an educational demo, not a professional security scanner.
- Password feedback is a simple heuristic, not a cryptographic strength measurement.
- URL clues are not proof of maliciousness. No warning does not mean a URL is safe.
- Do not type a real or reused password into a demo website.
- Never use this tool to test systems or links without appropriate authorization.

## Run locally

1. Download or clone this repository.
2. Open the project folder in VS Code.
3. Open `index.html` in a browser. You can use the VS Code **Live Server** extension if you have it, but it is optional.
4. Try a made-up password, inspect sample URLs without opening them, and complete the quiz.

## Project structure

```text
cybersafe-toolkit/
├── index.html
├── README.md
├── .gitignore
├── css/
│   └── styles.css
└── js/
    └── app.js
```

## Ideas to improve it

- Add unit tests for the URL parsing rules.
- Add a small glossary of common security terms.
- Add a high-contrast theme toggle.
- Improve the password feedback while keeping all processing local.
- Add a GitHub Actions workflow for HTML/JavaScript linting.

## Built with

- HTML5
- CSS3
- Vanilla JavaScript

## License

This project is provided for learning and portfolio practice. You may adapt it for your own educational use.
