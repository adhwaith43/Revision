// console.log("script.js")


// console.log("hello","world",3)
// console.error("error")
// console.warn("warning")


// const c=64
// console.log(`hi ${c}`)

//  npm init -y --->manage dependencies and versions
// npm-package manager used to install different dependencies

// const prompt = require("prompt-sync") 
// require ---> used to import stuffs

// const v = prompt("type something")
// console.log(v)

// // Data types
// String --> "" '' ``
// Boolean --> true false
// number  --> 12.34 8 -9
// undefined --> undefined
// null -->used when you have explicitly set something to empty or non existing
// bigint --> used to store big numbers that cant be stores in number types

// // ; --> can be used to finish off a line
// // Javascript has Automatic Semicolon Insertion (ASI)


// // Javasscript uses Camel case unlike python which uses snake case

// var helloworld ="hello"
// helloword='world'


// let x =3
// const velocity =34
// const and let are block scoped
// var-function scoped


// variable hoisting for var


// const x = 6
// const y ="7"

// console.log(x+y) ///67

// const x = 6
// const y =true

// console.log(x+y) ///7 ////true==>1

// const x = "hello"
// const y = false

// console.log(x+y) ///hellofalse

// const x = "hello"
// const y = 2

// console.log(x+y) ///Nan

//// type coercion /////


////// string to number

// const x ="245"
// const y =2

// console.log(Number(x)+y)

// const x ="245.34232 px"
// const y =2

// console.log(parseFloat(x)+y)


// const x ="245.34232 px"
// const y =2

// console.log(parseInt(x)+y)



/////// string to number

// const x ="245"
// const y =2

// console.log(String(x)+y)


// const x ="245"
// const y =2

// console.log(x.toString())


// const x ="245"
// const y =2

// console.log(x + "")


/////////////

// console.log("1" == 1) ///true

// console.log("1" === 1) ///false


// === strict equality operator
// !== strict inequality operator


// ///logical operators

// console.log(true || false)
// console.log("hello" || false) //hello---->kind of true
// console.log("" || false) //get what is on the right side

// console.log(true && "hello") //get what is on the right side
////if the condition is false display false


//// Ternary operator
// const cond= 2<3 ? "okay cool":"no"
// console.log(cond)


// switch statement

// const arr2=new Array(5)
// console.log(arr2) //intialise array with 5 spaces

// const arr2=Array.from("hello")
// console.log(arr2)


// const arr2=Array.from("hello")
// arr2[arr2.length + 5] = "test"
// console.log(arr2)

// arr2.pop() //removes the last element
// arr2.push(2) //add as last element
// arr2.shift() //removes the first element
// arr2.unshift('new') //add to begining of the array
// // console.log(arr2)


// const arr=[1,2,3,true]

// // const arr3 = arr.concat(arr2)

// const arr3=arr.splice(1,2)
// // const arr3=arr.slice(1,2)
// console.log(arr3)
// console.log(arr)



///// Array Destructuring //////

// const [x,y]=[1,2]
// console.log(x , y) // 1 2


// const [x,y] =[1,2,3,4,5]
// console.log(x,y) // 1 2

// const [x,y] =[1,2,3,4,5]
// console.log(x,y) // 1 2