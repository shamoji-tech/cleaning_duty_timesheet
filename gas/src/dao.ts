const mainSheetName: string = "main"
class SheetHandler {
    
    mainSheet : GoogleAppsScript.Spreadsheet.Sheet;
    lastRow : number ;
    sheetData: any[][];
    personsDataArray: PersonSheet[]= new Array;
    constructor(){
        this.mainSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(mainSheetName);
        this.lastRow = this.mainSheet.getLastRow()-1;
        this.sheetData = this.mainSheet.getRange(2,1,this.lastRow,5).getValues();
        this.sheetData.forEach(element =>{
            this.personsDataArray.push(new PersonSheet(element));
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
}
class PersonSheet {
    duty: boolean;
    root: boolean;
    name: string;
    id  : string;
    time: string;
    constructor(element:any[]){
        this.duty = element[0]==="*";
        this.root = element[1]==="*";
        this.name = element[2];
        this.id   = element[3];
        this.time = element[4];
    }
    toPerson():Person{
        return new Person(this.name,this.id);
    }
}


function test_SheetHadler (){
    const sheetHandler: SheetHandler = new SheetHandler();
    Logger.log(sheetHandler.personsDataArray)
    var person =sheetHandler.getWhoIsOnDuty();
    Logger.log(person)
}