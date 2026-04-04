import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import AdminNavbar from "../../Components/AdminNavbar"
import "../../Styles/Admin.css"

export default function ProviderPortfolio(){

const {id} = useParams()

const [provider,setProvider] = useState(null)


useEffect(()=>{

fetch(`http://127.0.0.1:8000/api/users/providers/${id}/`)
.then(res=>res.json())
.then(data=>{

console.log("Provider detail:",data)

setProvider(data)

})
.catch(err=>console.log(err))

},[id])


if(!provider){

return(

<div className="admin-layout">

<AdminNavbar backTo="/admin/service-providers"/>

<h2>Loading...</h2>

</div>

)

}


return(

<div className="admin-layout">

<AdminNavbar
backTo="/admin/service-providers"
pageTitle={`Portfolio — ${provider.name}`}
/>

<main className="sm-container sm-section">

<h1>{provider.name}</h1>

<p>Email: {provider.email}</p>

<p>Phone: {provider.phone}</p>

<p>Category: {provider.category?.join(", ")}</p>

</main>

</div>

)

}