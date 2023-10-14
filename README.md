# Wadit

Wadit is a tiny lightweight dev tool which build current working directory within a single command.  
<span style="color: yellow;">(less than 4 kb !)</span>

[Developed for own purpose and then published on internet]

## Installation

Use the package manager [npm](https://www.npmjs.com) to install Wadit from your terminal

```bash
npm i -g wadit
```
*Install Wadit globally to use CLI functionalities from your terminal*

#### [Published on npmjs](https://www.npmjs.com/package/wadit)

## 

### Build
```bash
wadit

# with custom configuration file
wadit -c "wadit.config.js"
```

If your configuration file is *wadit.config.js*, then you don't need to mention file path to CLI

 
### Initialize configuration
```bash
wadit init

# or with custom name
wadit -i "another.config.js"
```

### Show help menu
```bash
wadit help
# or
wadit -h
```

### Show version
```bash
wadit version
# or
wadit -v
```  



### Configuration 
```javascript
module.exports = {
    "input": "",                 // leave blank to input current directory
    "output": "output.zip", 
    "excludes": [                // exclude files and directory from build;
        "node_modules/**",
        ".git",
        ".gitignore",
        "src/scss/**"            // supports regular expression
    ],
    "before": [],                // callable or executable before the action
    "after": [],                 // callable or executable after the action
}
```

## Advanced

Element of Before and After array must be either executable command of the syste, or callable method by JavaScript. 

**Before** executes right before building the directory and **After** executes right after building the directory.

#### Before || After
```javascript
// example for after, but works same for before
"after" : [
    // executable
    'echo "Hello World!"',
    // callable anonymous function
    (config) => { 
        // code yourself
    },
    // callable class's method
    aClass.aMethod
]
```
 
## Contribution
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
Make a request at [Wadit GIT](https://github.com/imjafran/wadit) on github public repository
<br> 
Published by [Jafran Hasan](https://fb.com/IamJafran) 
