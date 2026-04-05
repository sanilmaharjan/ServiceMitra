import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../Components/AdminNavbar";
import "../../Styles/Admin.css";

export default function AdminServiceProviders() {

const navigate = useNavigate()

const [providers,setProviders] = useState([])
const [search,setSearch] = useState("")
const [filter] = useState("all")


useEffect(()=>{

fetch("http://127.0.0.1:8000/api/users/providers/")
.then(res=>res.json())
.then(data=>{

console.log("Providers from backend:",data)

const formatted = data.map(p=>({

id:p.id,
name:p.name,
category:p.category?.[0] || "Service",
email:p.email,
phone:p.phone,
avatar:p.name.charAt(0),
status:"verified",
location:"Nepal",
rating:4.5,
jobs:0

}))

setProviders(formatted)

})
.catch(err=>console.log(err))

},[])


const filtered = providers.filter((p)=>{

const matchSearch =
p.name.toLowerCase().includes(search.toLowerCase()) ||
p.category.toLowerCase().includes(search.toLowerCase())

const matchFilter = filter === "all" || p.status === filter

return matchSearch && matchFilter

})


return (

<div className="admin-layout animate-fade">

<AdminNavbar backTo="/admin" pageTitle="Service Providers"/>

<main className="sm-container sm-section">

<header className="page-header" style={{display:'flex',justifyContent:'space-between',marginBottom:'2rem'}}>

<h1>Service Professionals</h1>

<div className="sm-badge sm-badge-info">{providers.length} Partners</div>

</header>


<input
className="sm-input"
placeholder="Search provider..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>


<div className="sm-grid" style={{gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))'}}>

{filtered.map(p=>(

<div key={p.id} className="sm-card">

<div style={{fontSize:"40px"}}>{p.avatar}</div>

<h3>{p.name}</h3>

<p>{p.category}</p>

<button
className="sm-btn sm-btn-primary"
onClick={()=>navigate(`/admin/service-providers/${p.id}/portfolio`)}
>

View Portfolio

</button>

</div>

))}

</div>

</main>

</div>

)

}