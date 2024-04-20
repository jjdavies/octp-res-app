interface Animation{
    property:string,
    value:string | number;
    delay?:number
}

export default interface ActivityResource{
    resourceID:string,
    contentRefID:string,
    style:{
        width:number,
        height:number
    }
    resourceSettings:{
        visible:boolean,
        onCanvas:boolean,
        draggable:boolean,
        zPosType:string,
        orderStatus:string,
        staticOrder:number,
        startPosition:string,
        targetPosition:string,
        buildLocked:boolean,
        special:string,
        multichoice:string,
        animations:Animation[]
    }
}