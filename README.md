<p align="center" width="100%">
    <img width="33%" src="images/logo.png"> 
</p>

# Shodo-Notes
a highly opinionated markdown reader.

# Features
- Navigates to the last edited .md file (file system write events)
- Darkmode / Whitemode
- Headline Chips -> add useful links, neatly organised
    ```md
    # Hello world
    > _Links
    >
    > [I Programmed My Bidet to Play Megalovania](https://www.youtube.com/watch?v=YLNfQKjJWO8)
    > [](/attachements/test.md/hello.docx)
    > [](attachements/test.md/hello.xlsx)
    > [](attachements/test.md/cat.jpg)
    > [](onenote:👻)
    > [](/content/index.md)
    ```
    ![](/images/headline_chips.png)
- links to files automatically opens them using the default app
- onenote links are also supported
- multimd tables
    ```md
    | head 1          | head 2      |
    | (subhead 2)     | (subhead 2) |
    | --------------- | ----------- |
    | - hello                      || \
    | - helloooooo                 || \
    |                              || \
    | **whats up?**                ||
    | :)              | world       |
    ```
    ![](/images/multimd.png)

# FAQ
- Why does it automatically close when opened?
    > it has to be opened with a working directory path
    > `shodo.exe "C:\somedir"` 
- Is it possible to turn off the file update watching?
    > to only read the file and ignore modifications use the `-n` option
    > `shodo.exe "C:\somedir" -n`
- What is the prefered structure of content?
    ```
    / <-- Root
    --- /content/ <-- here live the markdown files
    ----------- /test.md
    ----------- /test.md/ <-- create a folder with the same name in order to sort by different "levels" or under categories
    ------------------- /hello.md
    --- /attachements/ <-- here lives the content (images, word docs, pdfs...)
    ---------------- /test.md/ <-- every markdown file should get its own folder
    ------------------------- /image.png
    ```
- How to navigate in the app?
    - by updating a file in the working directory
    - by clicking on the folders displayed in navbar
- How to print the current page (as pdf)?
    > to print the page select the printing mode int the nav bar
    > - pdf: is visually apealing but doesn't contain personal 'notes' like the headline chips, for exporting as pdf
    > - paper: same as pdf, but less visuals, for printing on paper
- How to specify the size of an image?
  ```markdown
  [this is a cat=200x](https://example.com/cat.jpg)
  [this is a cat=x200](https://example.com/cat.jpg)
  [this is a cat=300x200](https://example.com/cat.jpg)
  ```
# How to build?
## Prerequestits
- Windows
- Rust toolchain
## How?
- Clone the git repo
- `npm install` to install all dependencies
- `npm run tauri dev -- -- -- -- C:\somedir` to run in devmode
- `cargo tauri build` to build, the .msi will be located in `/target/release/bundle/msi/` 
