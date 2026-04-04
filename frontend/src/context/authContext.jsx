import { createContext, useState } from "react";


export const AuthContext = createContext({})

export const AuthProvider = ({children}) => {
	const [user, setUser] = useState(null)

	const setUserData = (userData) =>  {
		setUser(userData)
	}

	const getUserData = () => {
		return user
	}

	return <AuthContext.Provider value={{user, setUserData, getUserData}}>{children}</AuthContext.Provider>
}