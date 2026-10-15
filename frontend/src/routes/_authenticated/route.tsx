import{createFileRoute,Outlet,redirect}from"@tanstack/react-router";import{authService}from"@/services/adminService";
export const Route=createFileRoute("/_authenticated")({ssr:false,beforeLoad:async()=>{const user=await authService.currentUser();if(!user)throw redirect({to:"/auth"});return{user}},component:()=> <Outlet/>});
