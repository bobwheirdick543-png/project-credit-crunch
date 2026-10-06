import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthShell } from "@/components/soul/AuthShell";
import { supabase } from "@/integrations/supabase/client";
import { passwordSchema } from "@/lib/validation";

export const Route = createFileRoute("/reset-password")({ ssr:false, head:()=>({meta:[{title:"Choose a new password — Soul Life"},{name:"description",content:"Set a new secure password for Soul Life."},{property:"og:title",content:"Choose a new password — Soul Life"},{property:"og:description",content:"Secure your Soul Life account."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary"}]}), component:Reset });
function Reset(){const navigate=useNavigate();const [password,setPassword]=useState("");const [confirm,setConfirm]=useState("");const submit=async(e:React.FormEvent)=>{e.preventDefault();const p=passwordSchema.safeParse(password);if(!p.success){toast.error(p.error.issues[0]?.message??"Use a stronger password");return;}if(password!==confirm){toast.error("Passwords do not match");return;}const {error}=await supabase.auth.updateUser({password:p.data});if(error){toast.error(error.message);return;}toast.success("Password updated");await navigate({to:"/dashboard",replace:true})};return <AuthShell eyebrow="NEW PASSWORD" title="Secure your next chapter." copy="Choose a password you do not use anywhere else."><form onSubmit={submit} className="space-y-4"><Input type="password" className="glass-input h-12" placeholder="New password" value={password} onChange={(e)=>setPassword(e.target.value)}/><Input type="password" className="glass-input h-12" placeholder="Confirm new password" value={confirm} onChange={(e)=>setConfirm(e.target.value)}/><Button className="glass-button h-12 w-full">Update password</Button></form></AuthShell>}