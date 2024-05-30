import MediaResult from "./MediaResult";
import ResourceAnimationResult from "./ResourceAnimationResult";

export default interface ResourceResult{
    type:string;
    result:ResourceAnimationResult | MediaResult;
    
}