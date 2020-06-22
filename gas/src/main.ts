type MethodType = "getDuty" | "isRoot" | undefined;
class QueryParam {
    methodType: MethodType;

    constructor(query:string){
        try{
            var methodString :string
            query.split("&").forEach((s)=>{
                if (s.split("=")[0]==="method")
                {
                    methodString=s.split("=")[1]
                }
            })
            
            if (methodString === "getDuty"){
                this.methodType = "getDuty";
            }else if (methodString === "isRoot"){
                this.methodType = "isRoot";
            }else{
                console.log(methodString)
            }
        }catch(error){
            console.warn(error)
            this.methodType = undefined;
        }
    }
}

function doGet(e:GoogleAppsScript.Events.DoGet){
    var method : QueryParam
    
    method = new QueryParam(e.queryString)
    Logger.log("[GET Method]")
    Logger.log(e.queryString)
    if(method.methodType===undefined){
        return ContentService.createTextOutput("");
    }
    else if(method.methodType==="getDuty"){
        const onDutyPerson = new SheetHandler().getWhoIsOnDuty();
        return ContentService.createTextOutput(onDutyPerson.toJson());
    }else if(method.methodType==="isRoot"){
        return ContentService.createTextOutput("isRoot")
    }
}

