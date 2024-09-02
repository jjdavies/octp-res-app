import Action from './Action'
import ResourceEvent from './actionSystem/ResourceEvent';
import ActivityEvent from './actionSystem/ActivityEvent';

export default interface Trigger{
    id:string;
    type:string;
    trigger:ResourceEvent | ActivityEvent | Action;
}