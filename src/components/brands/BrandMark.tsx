import type { ReactNode } from 'react';
const shapes: Record<string, ReactNode> = {
 Nyke:<path d="M5 29 14 10 22 25 29 10 35 29M14 10 21 19 29 10"/>,
 Adira:<path d="m9 29 5-9m4 9 9-16m0 16 10-23"/>,
 NuBalance:<><rect x="5" y="5" width="30" height="30" rx="7"/><path d="M12 29V11m16 18V11"/><path className="brand-secondary" d="m12 11 16 18"/></>,
 Pumaa:<path d="m6 12 14 8-14 8m12-20 18 12-18 12"/>,
 Rebook:<path d="M10 32V8h9c14 0 13 15 0 15h-9m9 0c5 0 5 14 15 9"/>,
 Vanz:<><rect x="5" y="5" width="30" height="30" rx="6"/>{[[9,9],[23,9],[16,16],[9,23],[23,23]].map(([x,y])=><rect key={`${x}-${y}`} x={x} y={y} width="7" height="7" fill="currentColor" stroke="none"/>)}</>,
 Converze:<><circle cx="20" cy="20" r="16"/><path d="m20 8 3 9 10 1-8 6 2 10-7-6-8 6 2-10-8-6 11-1Z"/></>,
 Meridian:<><circle cx="20" cy="20" r="17" strokeWidth="1.5"/><path d="m20 4 2 15 12 10-14-7-14 7 12-10Z"/></>,
};
export function BrandMark({name='Meridian',className=''}:{name?:string | undefined;className?:string | undefined}) {
 return <svg viewBox="0 0 40 40" className={`brand-mark ${className}`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{shapes[name] ?? <path d="m20 5 15 9v15l-15 8-15-8V14Zm0 0v32M5 14l15 9 15-9"/>}</svg>;
}
