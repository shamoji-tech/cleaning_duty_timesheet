const mainSheetName: string = "main"
class SheetHandler {
    /* SheetHandler
     * 
     */
    mainSheet : GoogleAppsScript.Spreadsheet.Sheet;
    lastRow : number ;
    sheetData: any[][];
    personsDataArray: PersonSheet[]= new Array;
    constructor(){
        this.mainSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(mainSheetName);
        this.lastRow = this.mainSheet.getLastRow();
        //TODO:マジックナンバー
        this.sheetData = this.mainSheet.getRange(2,1,this.lastRow-1,5).getValues();
        this.sheetData.forEach(element =>{
            this.personsDataArray.push(PersonSheet.fromSheetElement(element));
        });
    }
    
    getWhoIsOnDuty(): Person{
        for (const item of this.personsDataArray){
            if(item.duty){
                return item.toPerson();
            }
        }
        throw new Error("当番を見つけられませんでした。データが全て空か、当番項目が全てハイフンになっている可能性があります。");
    }
    writeNewPerson(person:Person){
        const writeObject=PersonSheet.fromPerson(person)
        //TODO:マジックナンバー
        this.mainSheet.getRange(this.lastRow+1,1,1,5).setValues([writeObject.toValues()])
    }
    checkRoot(person:Person): boolean{
        for (const item of this.personsDataArray){
            if(person.slackId === item.id && item.root){
                return true
            }
        }
        return false
    }
    private changeDuty(id:number,isduty:boolean){
        const valueToSet = ["-","*"][Number(isduty)]
        //TODO: +2って言うマジックナンバーをどうにかする
        this.mainSheet.getRange(id+2,1).setValue(valueToSet)
    }
    changeNextDuty(){
        var changeFlag =false
        for(var index=0; index<this.personsDataArray.length;index++){
            if(changeFlag){
                changeFlag=false
                this.changeDuty(index,true)
            }
            if(this.personsDataArray[index].duty){
                changeFlag=true
                this.changeDuty(index,false)
            }
        }
        if(changeFlag){
            this.changeDuty(0,true)
        }
    }
}



class PersonSheet {
    duty: boolean;
    root: boolean;
    name: string;
    id  : string;
    time: string;
    constructor(duty:boolean,root:boolean,name:string,id:string,time:string){
        this.duty = duty
        this.root = root
        this.name = name
        this.id   = id
        this.time = time
    }
    toPerson():Person{
        return new Person(this.name,this.id);
    }
    toValues():any[]{
        const duty = ["-","*"][Number(this.duty)]
        const root = ["-","*"][Number(this.duty)]
        return [duty,root,this.name,this.id,this.time]
    }
    static fromSheet(elements:any[][]): PersonSheet[]{
        var personSheet :PersonSheet[]
        for(const item of elements){
            personSheet.push(PersonSheet.fromSheetElement(item))
        }
        return personSheet
    }

    static fromSheetElement(element:any[]): PersonSheet{
        return new PersonSheet(
            element[0]==="*",
            element[1]==="*",
            element[2],
            element[3],
            element[4]
        )
    }

    static fromPerson(person:Person){
        return new PersonSheet(
            false,
            false,
            person.personName,
            person.slackId,
            "",//new Date().toDateString()
        )
    }

}


function testSheetHadler (){
    const sheetHandler: SheetHandler = new SheetHandler();
    Logger.log(sheetHandler.personsDataArray)
    sheetHandler.writeNewPerson(new Person("テスト","xxxx"))
}

function testSheetHadlerChangeNextDuty(){
    const sheetHandler = new SheetHandler();
    sheetHandler.changeNextDuty()
}