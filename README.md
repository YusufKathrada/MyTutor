# MyTutor Application

A Tutor Management Application build using the Ionic Framework and Angular.

# Live Website

https://my-tutor-lime.vercel.app/


## Getting Started With The Application

* [Download the installer](https://nodejs.org/) for Node LTS.
* Install the ionic CLI globally: `npm install -g ionic`
* Run `npm install` from the project root (this might take a while). Note this is an important step, the app will not compile without the node modules (what we are installing here), so make sure that this works successfully.
* Run `ionic serve` in a terminal from the project root.

## Notes for versions control
* On vscode, after you have pulled from main, you should create your own branch and work on that branch.
* Name the branch as follows: `stage<2,3,4>/yourname`, e.g `stage2/Yusuf`. You can create this using the following command in your terminal: `git checkout -b stage<2,3,4>/yourname`.
* Do all your work on this branch
* When you are ready to push your changes, make sure you are on your branch and run the following commands:
    * `git add <files>`
    * `git commit -m "your commit message"`
    * `git push origin stage<2,3,4>/yourname`
* Then go to gitlab and create a merge request to merge your branch with main. This will allow us to review your code before merging it with main.
* For more info on git, see [this basic](https://git-scm.com/doc) ,[this branch basics](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging) and [this branch management](https://git-scm.com/book/en/v2/Git-Branching-Branch-Management).

<!-- ## Deploying

### Progressive Web App

1. Run `ionic build --prod`
2. Push the `www` folder to your hosting service

### Android

1. Run `ionic cordova run android --prod`

### iOS

1. Run `ionic cordova run ios --prod` -->
