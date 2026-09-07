import {create} from 'zustand'; import type {Project,ViewMode,Unit,DesignObject} from '../types'; import {clone,createProject,createFloor,makeObject,uid} from '../utils/project'; import {assets} from '../data/assets';
const KEY='dreamhome-projects-v1';
interface State{project:Project;view:ViewMode;grid:boolean;snap:boolean;activeFloorId:string;selectedId?:string;history:Project[];future:Project[];query:string;dark:boolean;setView:(v:ViewMode)=>void;setQuery:(q:string)=>void;select:(id?:string)=>void;switchFloor:(id:string)=>void;addAsset:(assetId:string)=>void;updateSelected:(patch:Partial<DesignObject>)=>void;deleteSelected:()=>void;duplicateSelected:()=>void;addFloor:()=>void;deleteFloor:()=>void;renameFloor:(name:string)=>void;undo:()=>void;redo:()=>void;newProject:()=>void;save:()=>void;load:(p:Project)=>void;setUnit:(u:Unit)=>void;toggleGrid:()=>void;toggleSnap:()=>void;applyTemplate:(name:string)=>void;}
const initial=createProject();
const seed=(floor:any, ids:string[], offset=0)=>ids.map((id,i)=>{const a=assets.find(x=>x.id===id)!;return makeObject(a,floor.id,(i%3)*5-5,0,Math.floor(i/3)*5+offset)});
initial.floors[0].objects=[...seed(initial.floors[0],['room-2','room-3','room-4','room-5','room-6','furn-12','furn-20','kit-1','kit-2','kit-3','furn-17','furn-16','door-0','window-1'])];
initial.floors[1].objects=[...seed(initial.floors[1],['room-1','room-9','room-8','room-7','room-5','furn-3','furn-6','furn-0','furn-17','elec-1','elec-3','bath-0','bath-4','furn-23','door-2','window-2'])];
const push=(s:State)=>({history:[...s.history,clone(s.project)].slice(-30),future:[]});
export const useDesigner=create<State>((set,get)=>({project:initial,view:'3D',grid:true,snap:true,activeFloorId:initial.floors[0].id,selectedId:undefined,history:[],future:[],query:'',dark:true,
setView:view=>set({view}),setQuery:query=>set({query}),select:selectedId=>set({selectedId}),switchFloor:activeFloorId=>set({activeFloorId}),
addAsset:assetId=>{const s=get(),a=assets.find(x=>x.id===assetId);if(!a)return;const floor=s.project.floors.find(f=>f.id===s.activeFloorId)||s.project.floors[0];const o=makeObject(a,floor.id,0,0,0);set({...push(s),project:{...s.project,floors:s.project.floors.map(f=>f.id===floor.id?{...f,objects:[...f.objects,o]}:f),updatedAt:new Date().toISOString()},selectedId:o.id});},
updateSelected:patch=>{const s=get();if(!s.selectedId)return;set({...push(s),project:{...s.project,floors:s.project.floors.map(f=>({...f,objects:f.objects.map(o=>o.id===s.selectedId?{...o,...patch}:o)}))}})},
deleteSelected:()=>{const s=get();if(!s.selectedId)return;set({...push(s),project:{...s.project,floors:s.project.floors.map(f=>({...f,objects:f.objects.filter(o=>o.id!==s.selectedId)}))},selectedId:undefined});},
duplicateSelected:()=>{const s=get(),id=s.selectedId;if(!id)return;const f=s.project.floors.find(f=>f.objects.some(o=>o.id===id));const o=f?.objects.find(o=>o.id===id);if(!f||!o)return;const n={...clone(o),id:uid(),x:o.x+1,z:o.z+1,name:o.name+' Copy'};set({...push(s),project:{...s.project,floors:s.project.floors.map(x=>x.id===f.id?{...x,objects:[...x.objects,n]}:x)},selectedId:n.id});},
addFloor:()=>{const s=get();const n=createFloor(`Floor ${s.project.floors.length}`,s.project.floors.length*3);set({...push(s),project:{...s.project,floors:[...s.project.floors,n]},activeFloorId:n.id})},
deleteFloor:()=>{const s=get();if(s.project.floors.length<=1)return;set({...push(s),project:{...s.project,floors:s.project.floors.slice(0,-1)},selectedId:undefined})},
renameFloor:name=>{const s=get(),id=s.project.floors[s.project.floors.length-1].id;set({...push(s),project:{...s.project,floors:s.project.floors.map(f=>f.id===id?{...f,name}:f)}})},
undo:()=>{const s=get(),h=[...s.history];const prev=h.pop();if(!prev)return;set({project:prev,history:h,future:[clone(s.project),...s.future].slice(0,30),selectedId:undefined})},
redo:()=>{const s=get(),next=s.future[0];if(!next)return;set({project:next,history:[...s.history,clone(s.project)].slice(-30),future:s.future.slice(1),selectedId:undefined})},
newProject:()=>{const p=createProject('Untitled House');set({project:p,history:[],future:[],activeFloorId:p.floors[0].id,selectedId:undefined})},
save:()=>{const s=get();const all=JSON.parse(localStorage.getItem(KEY)||'[]');const rest=all.filter((p:Project)=>p.id!==s.project.id);localStorage.setItem(KEY,JSON.stringify([...rest,s.project]));},
load:p=>set({project:clone(p),history:[],future:[],activeFloorId:p.floors[0].id,selectedId:undefined}),setUnit:u=>set({...push(get()),project:{...get().project,unit:u}}),toggleGrid:()=>set(s=>({grid:!s.grid})),toggleSnap:()=>set(s=>({snap:!s.snap})),
applyTemplate:name=>{
  const s=get();
  const map:any={Modern:['room-2','furn-12','furn-15','room-4','kit-0','kit-1','furn-3'],Luxury:['room-1','furn-3','furn-8','room-2','furn-13','furn-15','light-2'],Minimal:['room-2','furn-11','furn-15','decor-0']};
  const ids=map[name]||map.Modern;
  const f=s.project.floors.find(x=>x.id===s.activeFloorId)||s.project.floors[0];
  const additions=ids.map((id:string,i:number)=>makeObject(assets.find(a=>a.id===id)!,f.id,(i%3)*4-4,0,Math.floor(i/3)*4-2));
  set({...push(s),project:{...s.project,floors:s.project.floors.map(x=>x.id===f.id?{...x,objects:[...x.objects,...additions]}:x)}});
}}));
export function exportProject(p:Project){return JSON.stringify(p,null,2)} export function importProject(raw:string){const p=JSON.parse(raw);if(!p?.floors?.length)throw Error('Invalid project');return p as Project}
export function listProjects(){try{return JSON.parse(localStorage.getItem(KEY)||'[]') as Project[]}catch{return[]}}
