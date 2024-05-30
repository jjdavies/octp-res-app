import ActualValue from "./ActualValue";
import RelativeValue from "./RelativeValue";
import Trigger from "./Trigger";

export default interface ResourceAnimationResult{
    triggerEventRes:boolean;
    trigger?:Trigger;
    resourceID:string;
    property:string;
    valueType:string;
    value:ActualValue | RelativeValue;
}