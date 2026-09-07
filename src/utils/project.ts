import type {Project,Floor,DesignObject} from '../types';
export const uid=()=>Math.random().toString(36).slice(2)+Date.now().toString(36);
export const createFloor=(name='Ground Floor',elevation=0):Floor=>({id:uid(),name,elevation,visible:true,objects:[]});
export const createProject=(name='Modern Family Villa'):Project=>({id:uid(),name,unit:'ft',floors:[createFloor('Ground Floor',0),createFloor('First Floor',3)],updatedAt:new Date().toISOString()});
export const clone=(x:any)=>JSON.parse(JSON.stringify(x));
export function makeObject(asset:any,floorId:string,x=0,y=0,z=0):DesignObject{return{id:uid(),kind:asset.kind,assetId:asset.id,name:asset.name,floorId,x,y,z,width:asset.width,height:asset.height,depth:asset.depth,rotation:0,color:asset.color,material:asset.material,visible:true,locked:false};}
export const projectStats=(p:Project)=>{const os=p.floors.flatMap(f=>f.objects),rooms=os.filter(o=>o.kind==='room');return{floors:p.floors.length,rooms:rooms.length,doors:os.filter(o=>o.kind==='door').length,windows:os.filter(o=>o.kind==='window').length,furniture:os.filter(o=>['furniture','appliance','decor','light','outdoor'].includes(o.kind)).length,objects:os.length,area:rooms.reduce((a,o)=>a+o.width*o.depth,0)};};
