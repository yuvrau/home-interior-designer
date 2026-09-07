export type Unit = 'ft'|'in'|'m'|'cm';
export type ViewMode = '2D'|'3D'|'SPLIT';
export type ObjectKind = 'wall'|'door'|'window'|'room'|'furniture'|'light'|'decor'|'outdoor'|'appliance';
export type AssetCategory = 'Structure'|'Rooms'|'Doors'|'Windows'|'Furniture'|'Kitchen'|'Bathroom'|'Electronics'|'Lighting'|'Decoration'|'Outdoor';
export interface DesignObject { id:string; kind:ObjectKind; assetId:string; name:string; floorId:string; x:number; y:number; z:number; width:number; height:number; depth:number; rotation:number; color:string; material:string; visible:boolean; locked:boolean; groupId?:string; properties?:Record<string,string|number|boolean>; }
export interface Floor { id:string; name:string; elevation:number; visible:boolean; objects:DesignObject[]; }
export interface Project { id:string; name:string; unit:Unit; floors:Floor[]; selectedId?:string; updatedAt:string; }
export interface Asset { id:string; name:string; category:AssetCategory; kind:ObjectKind; icon:string; width:number; height:number; depth:number; color:string; material:string; tags:string[]; }
