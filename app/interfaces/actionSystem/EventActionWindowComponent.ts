import { FunctionComponent } from "react";

export default interface EventActionWindowComponent{
    id:string;
    component:FunctionComponent;
    prompt:string;
    pill:string;
    childComponents:{
        id:string;
        component:FunctionComponent;
        format:string;
    };
}