type MethodType = "getDuty" | "isRoot" | "writeName" | "changeNextDuty" |undefined;
class QueryParam {
    methodType: MethodType;
    name:string;
    id:string;
    constructor(query:string){
        try{
            var methodString :string
            query.split("&").forEach((param)=>{
                const key = param.split("=")[0]
                const value = param.split("=")[1]
                if (key==="method")
                {
                    methodString=value
                }else if(key==="name"){
                    this.name=value
                }else if(key==="id"){
                    this.id=value
                }
            })
            
            if (methodString === "getDuty"){
                this.methodType = "getDuty";
            }else if (methodString === "isRoot"){
                this.methodType = "isRoot";
            }else if(methodString === "writeName"){
                this.methodType = "writeName";
            }else if(methodString === "changeNextDuty"){
                this.methodType = "changeNextDuty"
            }else{
                console.warn("未定義なmethodが呼び出されました。");
                console.warn(methodString);
            }
        }catch(error){
            console.warn(error);
            this.methodType = undefined;
        }
    }
}

function doGet(e:GoogleAppsScript.Events.DoGet){
    var query : QueryParam
    
    query = new QueryParam(e.queryString);
    Logger.log("[GET Method]");
    Logger.log(e.parameter);
    if(query.methodType===undefined){
        return ContentService.createTextOutput("");
    }
    else if(query.methodType==="getDuty"){
        const onDutyPerson = new SheetHandler().getWhoIsOnDuty();
        return ContentService.createTextOutput(onDutyPerson.toJson());
    }
    else if(query.methodType==="isRoot"){
        const person = new Person("Hidden",query.id)
        return ContentService.createTextOutput(String(new SheetHandler().checkRoot(person)));
    }else{
        return ContentService.createTextOutput("BadRequest.");
    }
}

function doPost(e:GoogleAppsScript.Events.DoPost){
    var query = new QueryParam(e.queryString);
    Logger.log("[POST Method]");
    Logger.log(e.parameter);
    
    if(query.methodType===undefined){
        return ContentService.createTextOutput("");
    }
    else if(query.methodType==="writeName"){
        const sheetHandler = new SheetHandler();
        sheetHandler.writeNewPerson(new Person(query.name,query.id));
        return ContentService.createTextOutput("Request OK.");
    }else if(query.methodType==="changeNextDuty"){
        new SheetHandler().changeNextDuty()
        return ContentService.createTextOutput("Request OK.");
    }else{
        return ContentService.createTextOutput("BadRequest.");
    }

}