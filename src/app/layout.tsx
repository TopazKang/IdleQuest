import type {Metadata,Viewport} from 'next';import './globals.css';import {ServiceWorker} from '@/components/ServiceWorker';
export const metadata:Metadata={title:'IdleQuest',description:'A few minutes. One incident. Your call.',manifest:'./manifest.webmanifest',appleWebApp:{capable:true,title:'IdleQuest'}};export const viewport:Viewport={themeColor:'#0b1220',width:'device-width',initialScale:1};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body><main>{children}</main><ServiceWorker/></body></html>}
