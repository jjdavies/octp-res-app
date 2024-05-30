import ActivityResult from "./ActivityResult";
import ResourceAnimationResult from "./ResourceAnimationResult";
import MediaResult from "./MediaResult";

export default interface Result{
    id:string;
    type:string;
    result:ResourceAnimationResult | MediaResult | ActivityResult;
}