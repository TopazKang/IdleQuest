import type {Metadata,Viewport} from 'next';import './globals.css';import {ServiceWorker} from '@/components/ServiceWorker';
export const metadata:Metadata={title:'IdleQuest',description:'잠깐의 시간, 하나의 인시던트. 결정은 당신의 몫입니다.',manifest:'./manifest.webmanifest',appleWebApp:{capable:true,title:'IdleQuest'}};export const viewport:Viewport={themeColor:'#0b1220',width:'device-width',initialScale:1};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="ko"><body><main>{children}</main><ServiceWorker/></body></html>}
