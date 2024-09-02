import Condition from './actionSystem/Condition';
import Result from './actionSystem/Result';

import Trigger from './Trigger';

export default interface Action{
    id:string;
    triggers:Trigger[];
    conditions:Condition[];
    results:Result[];
}