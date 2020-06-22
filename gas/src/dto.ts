class Person {
    
    personName:string
    slackId:string

    constructor(name:string,id:string){
        this.personName = name
        this.slackId = id
    }
    
    toJson(){
        const person:object = {
            name: this.personName,
            id: this.slackId,
        }
        return JSON.stringify(person)
    }
}
