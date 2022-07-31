
//Named export - Can have any number of named exports
//Default export - Only one default export, Has no name

const message = 'Some message from myModule.js'
const name= 'Steve Bonhomme'

const location = 'Paris'

const getGreeting = (name) => {
    return `Hello ${name}`
}
export {message, name, location as default, getGreeting}