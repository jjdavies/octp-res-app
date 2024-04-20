import Action from './Action'
import ResourceEvent from './ResourceEvent';
import ActivityEvent from './ActivityEvent';

export default interface Trigger{
    id:string;
    type:string;
    trigger:ResourceEvent | ActivityEvent | Action;
}