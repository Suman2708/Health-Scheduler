import { createContext } from "react";

export const AppContext =createContext()

const AppContextProvider=(props)=>{

    const currency="$"

    const calculateAge = (dob)=>{
        const today= new Date()
        const birthDate=new Date(dob)
        let age=today.getFullYear()-birthDate.getFullYear()
        return age
    }

    const months=["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    
    const slotDateFormat = (slotDate) => {
        let dateArray;
      
        if (slotDate.includes("_")) {
          // If already in "DD_MM_YYYY" format
          dateArray = slotDate.split("_");
          return `${dateArray[0]} ${months[Number(dateArray[1])]} ${dateArray[2]}`;
        } else {
          // Convert from "YYYY-MM-DD" to "DD_MM_YYYY"
          const [year, month, day] = slotDate.split("-");
          return `${day} ${months[Number(month)]} ${year}`;
        }
      };

    const value={
        calculateAge,slotDateFormat,
        currency
    }

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider