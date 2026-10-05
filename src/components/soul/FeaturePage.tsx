import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "./AppShell";
import { ActionCard, PillTabs } from "./PageKit";

export type FeatureItem={title:string;copy:string;action:string;Icon:LucideIcon};
export function FeaturePage({title,copy,tabs,items}:{title:string;copy:string;tabs:string[];items:FeatureItem[]}){const[active,setActive]=useState(tabs[0]??"");return <AppShell title={title} copy={copy}><PillTabs items={tabs} active={active} onChange={setActive}/><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.map(item=><ActionCard key={item.title} {...item} onClick={()=>toast.success(`${item.title}: ${active}`)}/>)}</div></AppShell>}