import {HistoryEntry} from '@/game/model'; export interface StorageAdapter{getItem(key:string):string|null;setItem(key:string,value:string):void}
export const KEY='idlequest.history.v1'; export function loadHistory(s:StorageAdapter):HistoryEntry[]{try{const raw=s.getItem(KEY);if(!raw)return[];const data=JSON.parse(raw);return Array.isArray(data)?data:[]}catch{return[]}}
export function saveHistory(s:StorageAdapter,items:HistoryEntry[]){s.setItem(KEY,JSON.stringify(items.slice(0,20)))}
