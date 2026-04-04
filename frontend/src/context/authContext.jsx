import { createContext, useState } from "react";
import { useContext } from "react";


export const authContext = createContext({})




export const AuthContextProvider = ({children}) => {
	const [user, setUser] = useState(null)

	const setUserData = (userData) =>  {
		setUser(userData)
	}

	const getUserData = () => {
		return user
	}

	return <authContext.Provider value={{user, setUserData, getUserData}}>{children}</authContext.Provider>
}