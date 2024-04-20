import ActivityResource from "./ActivityResource";

interface Connection{
  a:string,
  b:string
}


export default interface ActivityStage{
    stageID:string;
    activityType: string;
    activityDescription: string;
    connections:Connection[];
    activitySettings: {
        resources:ActivityResource[];
    };
    thumb?:string
}