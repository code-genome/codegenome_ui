# Getting started with codegenome_ui

This project is a react single page application front end with a flask backend.

## Building the project

## Clone the repository, install the node modules and 
  - `git clone https://github.com/code-genome/codegenome_ui.git`
  - `yarn install`
## Create and activate a python virtual environment
  -  `python3 -m venv .venv`
  - `. .venv/bin/activate`
### Install  flask and dotenv 
  - `pip3 install -r requirements.txt`
  From the project root, create the cypress fixtures folder:
  - `mkdir -p cypress/fixtures`

## Build and run the website

  - `yarn build` (takes about 3m23s)
  - `python wsgi.py`

## testing from a browser

- Launch your favorite browser and enter the following URL in the address bar:

    `http://localhost:5000`
