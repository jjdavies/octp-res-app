import ActivityResource from './ActivityResource';
import ContentResource from './ContentResource';
import ActivityStage from './ActivityStage';
import Action from './Action'


export default interface Activity {
    resources: {
      imagesContents: ContentResource[],
    },
    stages:ActivityStage[],
    setup:{
      stages:string[]
    },
    actions:Action[],
    performance:any
  }