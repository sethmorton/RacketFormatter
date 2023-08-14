# 📝 SvelteKit Racket Formatter

Welcome to the SvelteKit Racket Formatter project! This project allows you to format your Racket code easily and efficiently. 🚀

## 📚 Table of Contents

- [🚀 Getting Started](#getting-started)
- [📃 Introduction](#introduction)
- [⚙️ Options](#options)
- [🔍 Formatting Logic](#formatting-logic)
- [📬 Contact](#contact)
- [🙌 Acknowledgments](#acknowledgments)

## 🚀 Getting Started

To get started with the SvelteKit Racket Formatter, follow these steps:

1. Clone this repository to your local machine.
```bash
   git clone <repository-url>
Install the dependencies using npm (Node Package Manager).
```
2. Clone this repository to your local machine.
```bash
    npm install
```
3. Run the development server.
```bash
    npm run dev
```
## 📃 Introduction

The SvelteKit Racket Formatter is a web application that allows you to format your Racket code for improved readability and maintainability. It leverages the power of SvelteKit to provide a seamless and interactive user experience.

## ⚙️ Options

You have the flexibility to customize the formatting of your Racket code using the following options:

- **Insert Spaces**: Choose whether to use spaces for indentation.
- **Tab Size**: Specify the number of spaces for each tab.

To adjust these options, click the "Options" button within the application interface.

## 🔍 Formatting Logic

The heart of the Racket code formatting process lies in the `formatLispCode` function. This function takes unformatted Racket code and applies a set of rules to enhance its structure:

- Indentation: The function honors indentation preferences (spaces or tabs) based on user options.
- Lists and Brackets: Open and close brackets are balanced, and proper new lines are inserted.
- Comments: Comment lines are respected, and code formatting is preserved around comments.
- Strings: Strings within the code are preserved.

For detailed implementation, refer to the [`formatLispCode` script](#formatting-logic).

## 📬 Contact

If you encounter any issues or have suggestions, feel free to reach out to the project author:

Author: [Seth Morton](https://github.com/sethmorton)
Email: [smphotography39@gmail.com](mailto:smphotography39@gmail.com)

## 🙌 Acknowledgments

The formatting logic for this project is based on the [lispbeautifier](https://github.com/Sir2B/lispbeautifier) VS Code Plugin. Special thanks to [Sir2B](https://github.com/Sir2B) for his valuable work.

---

Thank you for choosing the SvelteKit Racket Formatter! We hope this tool enhances your Racket coding experience. 🎉