import Condition from './Condition';
import Result from './Result';

import Trigger from './Trigger';

export default interface Action{
    id:string;
    triggers:Trigger[];
    conditions:Condition[];
    results:Result[];
}