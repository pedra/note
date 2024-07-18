# Electronizer

Template to start an Electron project with integrated nodejs server (express 4) to serve local web pages (http://localhost). Access to systray, jumplist (Windows), thumbar, desktop menu, etc.

I included a (fake) application that can be modified with your own code or completely eliminated to start from scratch.

### Directories

| Path | Description |
| :--- | :--- |
| **./src** | development codes |
| **./dist** | compiled distribution files |
| **./pack** | application files required by Electron-Builde |
| **./assets** | "external" files added to the distribution package \(not compressed in the ASA\) |

The **application** is divided into two parts, which can be seen in the ./src folder:

| Path | Description |
| :--- | :--- |
| **./src/app** | Electron's encapsulation \(systray, boot, OS configurations ...\). This is the base that supports the application on your OS. |
| **./src/net** | If the application has a web server, where other network users can access via API, socket or simple PWA/WEB applications, here is your working directory. |

### Install

Electronizer has two layers: the **development** layer, which is installed in the ./src folder and the **build** layer, at the root of the project.

You need to install NPM dependencies on these two layers:

```text
npm i
cd src
npm i
```

### Start

To run the code under development, type this at the root of the project \(not inside ./src\):

```text
npm start
```

If your operating system is **Windows**, enter the following command to run:

```text
npm run elizer
```

### Build

To create a test build, type:

```text
npm run build
```

Check ./dist directory.

### Pack

This command creates the packaged files to be sent to users to install the application. We will soon have more details in the <a href="https://www.electron.build">documentation</a> on packaging particularities for different operating systems \(MacOs, Linux and Windows\).

```text
npm run dist
```

Than, check the ./dist directory.

### More

**Elize** - a CLI to use with this template!  
Coming soon in [https://github.com/pedra/elize](https://github.com/pedra/elize)

The code is partially in Brazilian **Portuguese**.   
Help to **translate** is very much desired!

----

### Bill Rocha 

prbr@ymail.com | https://billrocha.netlify.app

Feel invited to buy me a coffee 👋 - please!